import random
from textual.app import ComposeResult
from textual.screen import Screen, ModalScreen
from textual.widgets import Label,Button, Static
from textual.containers import Horizontal, Center, Vertical, Container
from views.Lib.image_viewer import ImageViewer
from PIL import Image
import requests
from io import BytesIO
from textual import work

vs_text ="""
 __      _______ 
 \ \    / / ____|
  \ \  / / (___  
   \ \/ / \___ \ 
    \  /  ____) |
     \/  |_____/ 
"""
class VSCard(Static):

    def on_click(self):
        self.parent_screen.guessed_id = self.pokemon_secret_id
        self.parent_screen.show_winner()

    def __init__(self,parent_screen,pokemon_secret_id):
        super().__init__()
        self.image = self.app.pokemon_img
        self.pokemon_secret_id = pokemon_secret_id
        self.image_viewer = ImageViewer(self.image)
        self.label = Label("???")
        self.parent_screen = parent_screen

    def compose(self) -> ComposeResult:
        yield self.image_viewer
        yield self.label
    
    def update(self,name,image,new_id):
        self.pokemon_secret_id = new_id
        self.image_viewer.change_image(image)
        self.label.update(name)


class WinnerPopout(ModalScreen):

    def __init__(self,winner,guess, name: str | None = None, id: str | None = None, classes: str | None = None) -> None:
        super().__init__(name, id, classes)
        self.winner_label = Label(f"{winner} won")
        if guess == True:
            self.outcome_label = Label("Congratulations")
        else:
            self.outcome_label = Label("Too bad")

        self.close_button = Button("Back", id="close_popuot_button", variant="default")

    def compose(self) -> ComposeResult:
        with Container():
            yield self.winner_label
            yield self.outcome_label
            yield self.close_button

    def on_button_pressed(self, event: Button.Pressed) -> None:
        if(event.button.id == "close_popuot_button"):
            self.app.pop_screen()


class VSScreen(Screen):
    CSS_PATH = "vs.css"

    def __init__(self):
        super().__init__()
        self.needToLoad = 0

        self.curr_score_label = Label(f"Streak : 0",id="vs_score")
        self.score = 0
        self.back_button = Button("Back",variant="error",id="back_button")

        self.first_pokemon_nr = random.randint(0,self.app.MAX_POKEMONS)
        self.second_pokemon_nr = random.randint(0,self.app.MAX_POKEMONS)
        while self.first_pokemon_nr == self.second_pokemon_nr:
            self.second_pokemon_nr = random.randint(0,self.app.MAX_POKEMONS)

        self.left_pokemon = VSCard(self,self.first_pokemon_nr)
        self.right_pokemon = VSCard(self,self.second_pokemon_nr)

        self.get_random_pokemon(self.left_pokemon,self.first_pokemon_nr)
        self.get_random_pokemon(self.right_pokemon,self.second_pokemon_nr)


    def on_button_pressed(self, event: Button.Pressed) -> None:
        if(event.button.id == "back_button"):
            self.app.unload_vs()

    def compose(self) -> ComposeResult:
        with Center():
            with Horizontal():
                yield self.left_pokemon
                with Vertical():
                    yield Label(vs_text,id="vs_label")
                    yield self.curr_score_label
                yield self.right_pokemon
        with Center():
            yield self.back_button
    

    def get_random_pokemon(self,card,nr):
        name = self.get_name(nr)
        image = self.get_img(nr)
        card.update(name,image,nr)


    @work(exclusive=True, thread=True)
    async def reaload_pokemons(self):
        self.left_pokemon.disable = True
        self.right_pokemon.disable = True
        self.back_button.disabled = True
        self.get_random_pokemon(self.left_pokemon,self.first_pokemon_nr)
        self.get_random_pokemon(self.right_pokemon,self.second_pokemon_nr)
        self.left_pokemon.disable = False
        self.right_pokemon.disable = False
        self.back_button.disabled = False
        
    def get_name(self,nr):
        api_url = f"http://localhost:8000/pokemon/wild/name/{nr}"
        headers = {"Authorization" : self.app.token}
        response = requests.get(api_url,headers=headers)

        if response.status_code == 200:
            return response.json()['name']
        else:
            return "???"

    def get_img(self,nr):
        api_url = f"http://localhost:8000/pokemon/wild/img/{nr}"
        headers = {"Authorization" : self.app.token}
        json_data = {'resolution': 128}
        response = requests.get(api_url,json=json_data,headers=headers)

        if response.status_code == 200:
            return Image.open(BytesIO(response.content))
        else:
            return self.app.pokemon_img

    def get_fight_result(self):
        api_url = "http://localhost:8000/pokemon/wild/fight"
        headers = {"Authorization" : self.app.token}
        json_data = {
            'firstSecretId':self.first_pokemon_nr,
            'secondSecretId':self.second_pokemon_nr,
            'guess':self.guessed_id,

        }
        response = requests.post(api_url,json=json_data,headers=headers)
        
        if response.status_code == 200:
            return response.json()
        else:
            return "ERROR"

    def show_winner(self):


        data = self.get_fight_result()
        winner_name = "ERROR"
        good_guess = False
        
        if data['yourGuess'] == True:
            self.score += 1
            good_guess = True
            self.curr_score_label.update(f"Streak : {self.score}")
            winner_name = data['winner']['name']

        elif data['yourGuess'] == False:
            self.score = 0
            self.curr_score_label.update(f"Streak : {self.score}")
            winner_name = data['winner']['name']
        else:
            self.curr_score_label.update(f"CONECTION ERROR")
            self.score = -1

        self.app.push_screen(WinnerPopout(winner_name, good_guess ))
        
        self.first_pokemon_nr = random.randint(0,self.app.MAX_POKEMONS)
        self.second_pokemon_nr = random.randint(0,self.app.MAX_POKEMONS)
        while self.first_pokemon_nr == self.second_pokemon_nr:
            self.second_pokemon_nr = random.randint(0,self.app.MAX_POKEMONS)

        self.reaload_pokemons()


            