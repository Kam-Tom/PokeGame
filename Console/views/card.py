from textual.app import  ComposeResult
from textual.screen import Screen
from textual.widgets import Button, Input, Static, ProgressBar
from textual.containers import Horizontal, Vertical
from views.Lib.image_viewer import ImageViewer
from PIL import Image
import requests
from io import BytesIO

LINES = """none
normal
fighting
flying
poison
ground
rock
bug
ghost
steel
fire
water
grass
electric
psychic
ice
dragon
dark
fairy
unknown
shadow""".splitlines()




class Card(Static):
    def __init__(self,image,data):
        super().__init__()
        # self.mainType =  Select((line, line) for line in LINES)
        # self.mainType.prompt = "MainType"
        # self.mainType.value = "ground"
        self.image_viewer = ImageViewer(image,0)
        # self.secondType =  Select((line, line) for line in LINES)
        # self.secondType.prompt = "SecondType"
        
        self.progressBar = ProgressBar(total=3, show_eta=False)
        self.progressBar.progress = 0

        self.id_input = Input(placeholder="0")
        self.id_input.border_title = "ID"

        self.name_input = Input(placeholder="vaporeon")
        self.name_input.border_title = "NAME"

        self.generation_input = Input(placeholder="1")
        self.generation_input.border_title = "GENERATION"

        self.refresh_form(data,True)
    
    def get_form(self):
        return {
            'id':self.id_input.value,
            'name':self.name_input.value,
            'generation':self.generation_input.value,
            'mainType':"",
            'secondType':""
        }

    def refresh_form(self,data,first_time = False):
        valid_count = 0

        if data['id']:
            valid_count += 1
            self.id_input.value = data['id']
            self.id_input.remove_class('in-valid')
            self.id_input.add_class('valid')
            self.id_input.disabled = True
        elif first_time == False:
            self.id_input.add_class('in-valid')
        else:
            self.id_input.remove_class('in-valid')

        if data['name']:
            valid_count += 1
            self.name_input.value = data['name']
            self.name_input.remove_class('in-valid')
            self.name_input.add_class('valid')
            self.name_input.disabled = True
        elif first_time == False:
            self.name_input.add_class('in-valid')
        else:
            self.name_input.remove_class('in-valid')

        if data['generation']:
            valid_count += 1
            self.generation_input.value = data['generation']
            self.generation_input.remove_class('in-valid')
            self.generation_input.add_class('valid')
            self.generation_input.disabled = True
        elif first_time == False:
            self.generation_input.add_class('in-valid')
        else:
            self.generation_input.remove_class('in-valid')

        self.progressBar.progress = valid_count
        # if data['mainType']:
        #     self.mainType.value = data['mainType']
        #     self.mainType.add_class('valid')
        #     self.mainType.disabled = True
        # else:
        #     self.mainType.add_class('in-valid')

        # if data['secondType']:
        #     self.secondType.value = data['secondType']
        #     self.secondType.add_class('valid')
        #     self.secondType.disabled = True
        # else:
        #     self.secondType.add_class('in-valid')

    def update_image(self,image):
        self.image_viewer.change_image(image)




    def compose(self) -> ComposeResult:
        # yield self.image_viewer
        with Horizontal():
            yield self.image_viewer
            with Vertical():
                yield self.progressBar
                yield self.id_input
                yield self.name_input
                yield self.generation_input
                # with Horizontal(): 
                #     yield self.mainType
                #     yield self.secondType
                with Horizontal(id="button_handler"): 
                    yield Button("Back",variant="error",id="back_button")
                    yield Button("Submit",variant="success",id="submit_button")



class CardScreen(Screen):
    CSS_PATH = "card.css"

    def __init__(self,data, name: str | None = None, id: str | None = None, classes: str | None = None) -> None:
        super().__init__(name, id, classes)
        image = self.load_image(int(data['secretId']))
        self.secretId = int(data['secretId'])
        self.data = data
        self.card = Card(image,data)

    def compose(self) -> ComposeResult:
        yield self.card

    def on_button_pressed(self, event: Button.Pressed) -> None:
        if(event.button.id == "back_button"):
           self.app.unload_card()
        if(event.button.id == "submit_button"):
            self.submit()


    def submit(self):
        api_url = f"http://localhost:8000/pokemon/{self.secretId}"
        headers = {"Authorization" : self.app.token}
        json_data = self.card.get_form()

        response = requests.put(api_url,json=json_data,headers=headers)

        if response.status_code == 200 or response.status_code == 201:
            self.refresh_form(False)

    
    def refresh_form(self,first_time):

        new_data = self.load_data()
        if self.data['name'] == '' and new_data['name'] != '':
            self.image = self.load_image(self.secretId)
            self.card.update_image(self.image)

        self.data = new_data
        self.card.refresh_form(self.data,first_time)

    def load_data(self):
        api_url = f"http://localhost:8000/pokemon/data/{self.secretId}"
        headers = {"Authorization" : self.app.token}
        response = requests.get(api_url,headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            return {'secretId':"",'id':"",'name':"",'generation':"",'mainType':"",'secondType':""}
        
    def load_image(self,nr):
        api_url = f"http://localhost:8000/pokemon/img/{nr}"
        headers = {"Authorization" : self.app.token}
        json_data = {'resolution': 128}
        response = requests.get(api_url,json=json_data,headers=headers)

        if response.status_code == 200:
            return Image.open(BytesIO(response.content))
        else:
            return self.app.pokemon_img

