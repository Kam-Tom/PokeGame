from typing import Type
from textual._path import CSSPathType
from textual.app import App, CSSPathType
from textual.driver import Driver
from views.login import LoginScreen
from views.game_mode import GameModeScreen
from views.witp import WITPScreen
from views.vs import VSScreen
from views.card import CardScreen
from PIL import Image
from pathlib import Path

class MyApp(App):

    def __init__(self, driver_class: type[Driver] | None = None, css_path: CSSPathType | None = None, watch_css: bool = False):
        super().__init__(driver_class, css_path, watch_css)

    def on_ready(self) -> None:
        self.screen_list = []
        self.screen_list.append(LoginScreen())
        self.push_screen(self.screen_list[-1])

    def load_gamemode(self,token) -> None:
        self.token = token
        self.witp_page = 0
        self.MAX_POKEMONS = 1017
        self.pokemon_img = Image.open(Path("no-img.png"))
        self.screen_list.append(GameModeScreen())
        self.push_screen(self.screen_list[-1])

    def load_vs(self) -> None:
        self.screen_list.append(VSScreen())
        self.push_screen(self.screen_list[-1])

    def load_witp(self) -> None:
        self.screen_list.append(WITPScreen())
        self.push_screen(self.screen_list[-1])

    def load_card(self,data) -> None:
        self.screen_list.append(CardScreen(data))
        self.push_screen(self.screen_list[-1])

    def unload_vs(self) -> None:
        self.pop_screen()
        self.screen_list.pop()
        self.screen_list[-1].load_player_data()

    def unload_card(self) -> None:
        self.pop_screen()
        self.screen_list.pop()
        self.witp_page -= 6 
        self.screen_list[-1].load_images(1)
        
    def unload_witp(self) -> None:
        self.pop_screen()
        self.screen_list.pop()
        self.screen_list[-1].load_player_data()

if __name__ == "__main__":
    MyApp().run()

