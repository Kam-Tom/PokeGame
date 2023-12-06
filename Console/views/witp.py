from typing import Self
from textual.app import ComposeResult
from textual.screen import Screen
from textual.widgets import Label,Button, ProgressBar
from textual.containers import Horizontal, Center 
from textual.widget import Widget
from views.Lib.image_viewer import ImageViewer
from PIL import Image
import requests
from io import BytesIO
from textual import work

class PokemonCard(Widget):

    def on_click(self) -> None:
        if self.disable == False:
            self.app.load_card(self.data)

    def update(self,data,image:Image) -> None:
        self.image = image
        self.data = data
        self.image_viewer.change_image(image)
        procentage = 0
        if data['id'] != '':
            procentage+=1
        if data['name'] != '':
            self.label.update(data['name'])
            procentage+=1
        else:
            self.label.update("???")
        if data['generation'] != '':
            procentage+=1  
        self.progressBar.progress = procentage
        

    def __init__(self):
        super().__init__()
        self.image = self.app.pokemon_img
        self.image_viewer = ImageViewer(self.image)
        self.progressBar = ProgressBar(total=3, show_eta=False)
        self.progressBar.progress = 0
        self.label = Label("???")

    def focus(self, scroll_visible: bool = True) -> Self:
        return super().focus(scroll_visible)
    

    def compose(self) -> ComposeResult:
        yield self.image_viewer
        yield self.label
        yield self.progressBar




class WITPScreen(Screen):
    CSS_PATH = "witp.css"

    def __init__(self):
        super().__init__()
        self.cards = []
        self.cards.append(PokemonCard())
        self.cards.append(PokemonCard())
        self.cards.append(PokemonCard())
        self.cards.append(PokemonCard())
        self.cards.append(PokemonCard())
        self.cards.append(PokemonCard())
        self.left_button = Button("<",variant="primary",id="left_button")
        self.back_button = Button("Back",variant="error",id="back_button")
        self.right_button = Button(">",variant="primary",id="right_button")


        self.page_nr = Label(f"{len(self.cards)}/{self.app.MAX_POKEMONS}",id="page_nr")
        self.load_images(1)
    
    def compose(self) -> ComposeResult:
        with Center():
            with Horizontal():
                yield self.cards[0]
                yield self.cards[1]
                yield self.cards[2]
            with Horizontal():
                yield self.cards[3]
                yield self.cards[4]
                yield self.cards[5]
            yield self.page_nr
            with Horizontal():
                yield self.left_button
                yield self.back_button
                yield  self.right_button

    def on_button_pressed(self, event: Button.Pressed) -> None:
        if(event.button.id == "back_button"):
            self.app.unload_witp()
        if(event.button.id == "left_button"):
            self.load_images(-1)
        if(event.button.id == "right_button"):
            self.load_images(1)
    
    @work(exclusive=True, thread=True)
    async def load_images(self,dir):

        self.block_input(True)

        if dir == -1 and (self.app.witp_page <= len(self.cards)):
            self.app.witp_page = self.app.MAX_POKEMONS - len(self.cards)
        elif dir == -1:
            self.app.witp_page -= len(self.cards)*2

        for i in range(1, len(self.cards)+1):

            self.app.witp_page += 1
            if self.app.witp_page < 1:
                self.app.witp_page = self.app.MAX_POKEMONS
            if self.app.witp_page > self.app.MAX_POKEMONS:
                self.app.witp_page = 1

            data = self.load_data(self.app.witp_page)
            image = self.load_image(self.app.witp_page)
            self.cards[i-1].update(data,image)

        self.block_input(False)


    def block_input(self,block):
        for card in self.cards:
            card.disable = block
            

        self.left_button.disabled = block
        self.back_button.disabled = block
        self.right_button.disabled = block

        if block == True:
            self.page_nr.update("Loading...")
        else:
            self.page_nr.update(f"{self.app.witp_page}/{self.app.MAX_POKEMONS}")


            
    def load_image(self,nr):
        api_url = f"http://localhost:8000/pokemon/img/{nr}"
        headers = {"Authorization" : self.app.token}
        json_data = {'resolution': 64}
        response = requests.get(api_url,json=json_data,headers=headers)

        if response.status_code == 200:
            return Image.open(BytesIO(response.content))
        else:
            return self.app.pokemon_img

    def load_data(self,nr):
        api_url = f"http://localhost:8000/pokemon/data/{nr}"
        headers = {"Authorization" : self.app.token}
        response = requests.get(api_url,headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            return {'secretId':"",'id':"",'name':"",'generation':"",'mainType':"",'secondType':""}