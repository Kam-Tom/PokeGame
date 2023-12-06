from textual.app import  ComposeResult
from textual.screen import Screen
from textual.widgets import Label,Button,  Static, ProgressBar
from textual.containers import Horizontal, Center
import requests

vs_label = """
        ┓ ┏┓┏┏┓╹┏┓  ┏┓┏┳┓┳┓┏┓┳┓┏┓┏┓┳┓
        ┃┃┃┣┫┃┃ ┗┓  ┗┓ ┃ ┣┫┃┃┃┃┃┓┣ ┣┫
        ┗┻┛┛┗┗┛ ┗┛  ┗┛ ┻ ┛┗┗┛┛┗┗┛┗┛┛┗                                                       
"""
witp_label = """
    ┓ ┏┓┏┏┓╹┏┓  ┏┳┓┓┏┏┓┏┳┓  ┏┓┏┓┓┏┓┏┓┳┳┓┏┓┳┓
    ┃┃┃┣┫┃┃ ┗┓   ┃ ┣┫┣┫ ┃   ┃┃┃┃┃┫ ┣ ┃┃┃┃┃┃┃
    ┗┻┛┛┗┗┛ ┗┛   ┻ ┛┗┛┗ ┻   ┣┛┗┛┛┗┛┗┛┛ ┗┗┛┛┗                                                    
"""
class WITPMinigameWrapper(Static):
    def compose(self) -> ComposeResult:
        yield Label(witp_label)
        with Horizontal():
            yield Label("Ids")
            yield ProgressBar(id="ids",total=self.app.MAX_POKEMONS, show_eta=False)
        with Horizontal():
            yield Label("Names")
            yield ProgressBar(id="names",total=self.app.MAX_POKEMONS, show_eta=False)
        with Horizontal():
            yield Label("Generations")
            yield ProgressBar(id="generations",total=self.app.MAX_POKEMONS, show_eta=False)
        with Center():
            yield Button("Play",id="witp_button")

    def set_score(self,ids,names,generations):
        self.query_one("#ids").progress = ids
        self.query_one("#names").progress = names
        self.query_one("#generations").progress = generations

class VSMinigameWrapper(Static):
    def compose(self) -> ComposeResult:
        yield Label(vs_label)
        with Horizontal():
            yield Label("SCORE:")
            yield Label("0",id="max_score")
        with Center():
            yield Button("Play",id="vs_button")

    def set_score(self,score):
        self.query_one("#max_score").update(str(score))



class GameModeScreen(Screen):
    CSS_PATH = "game_mode.css"

    def __init__(self, name: str | None = None, id: str | None = None, classes: str | None = None) -> None:
        super().__init__(name, id, classes)
        self.witp = WITPMinigameWrapper()
        self.vs = VSMinigameWrapper()
        
    def on_mount(self) -> None:
        self.load_player_data()

    def compose(self) -> ComposeResult:
        with Center():
            with Horizontal():
                yield self.witp
                yield self.vs
        with Center():
            yield Button("Back",id="back_button",variant="error")

    def on_button_pressed(self, event: Button.Pressed) -> None:
        if(event.button.id == "back_button"):
           self.app.pop_screen()
        if(event.button.id == "vs_button"):
            self.app.load_vs()
        if(event.button.id == "witp_button"):
            self.app.load_witp()

    def load_player_data(self):
        api_url = "http://localhost:8000/user"

        headers = {"Authorization" : self.app.token}
        response = requests.get(api_url,headers=headers)

        if response.status_code == 200:
            self.vs.set_score(response.json()['data']['vsScore'])
            data = response.json()['data']
            ids = 0
            names = 0
            generations = 0
            for i in range(1,10):
                ids += data[f'gen{i}Score'][0]
                names += data[f'gen{i}Score'][1]
                generations += data[f'gen{i}Score'][2]
            self.witp.set_score(ids,names,generations)
        else:
            self.vs.set_score(-1)
            self.witp.set_score(-1,-1,-1)
