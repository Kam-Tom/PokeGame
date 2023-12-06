from textual.app import ComposeResult
from textual.screen import Screen
from textual.widgets import Label,Button, Input,Static
from textual.containers import Horizontal

import requests


username_taken_label_text = """
╦ ╦┌─┐┌─┐┬─┐┌┐┌┌─┐┌┬┐┌─┐  ┬┌─┐  ┌─┐┬  ┬─┐┌─┐┌─┐┌┬┐┬ ┬  ┌┬┐┌─┐┬┌─┌─┐┌┐┌
║ ║└─┐├┤ ├┬┘│││├─┤│││├┤   │└─┐  ├─┤│  ├┬┘├┤ ├─┤ ││└┬┘   │ ├─┤├┴┐├┤ │││
╚═╝└─┘└─┘┴└─┘└┘┴ ┴┴ ┴└─┘  ┴└─┘  ┴ ┴┴─┘┴└─└─┘┴ ┴─┴┘ ┴    ┴ ┴ ┴┴ ┴└─┘┘└┘
"""
username_taken_text = """
Username is already taken, try diffrent one.
"""
wrong_password_label_text = """
┬ ┬┬─┐┌─┐┌┐┌┌─┐  ┌─┐┌─┐┌─┐┌─┐┬ ┬┌─┐┬─┐┌┬┐
│││├┬┘│ │││││ ┬  ├─┘├─┤└─┐└─┐││││ │├┬┘ ││
└┴┘┴└─└─┘┘└┘└─┘  ┴  ┴ ┴└─┘└─┘└┴┘└─┘┴└──┴┘
"""
loged_text="""
┬  ┌─┐┌─┐┌─┐┌─┐┌┬┐  ┬┌┐┌
│  │ ││ ┬│ ┬├┤  ││  ││││
┴─┘└─┘└─┘└─┘└─┘─┴┘  ┴┘└┘
"""
registered_text="""
┬─┐┌─┐┌─┐┬┌─┐┌┬┐┌─┐┬─┐┌─┐┌┬┐
├┬┘├┤ │ ┬│└─┐ │ ├┤ ├┬┘├┤  ││
┴└─└─┘└─┘┴└─┘ ┴ └─┘┴└─└─┘─┴┘
"""

wrong_password_text = """
Password dont match username, try again.
"""
title_label_text = """
██████╗  ██████╗ ██╗  ██╗███████╗ ██████╗  █████╗ ███╗   ███╗███████╗
██╔══██╗██╔═══██╗██║ ██╔╝██╔════╝██╔════╝ ██╔══██╗████╗ ████║██╔════╝
██████╔╝██║   ██║█████╔╝ █████╗  ██║  ███╗███████║██╔████╔██║█████╗  
██╔═══╝ ██║   ██║██╔═██╗ ██╔══╝  ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝  
██║     ╚██████╔╝██║  ██╗███████╗╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗
╚═╝      ╚═════╝ ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
"""
class Wrapper(Static):
    def compose(self) -> ComposeResult:
        yield Label(username_taken_label_text,classes="hidden",id="error")
        yield Label(username_taken_text,classes="hidden",id="message")
        yield Input(placeholder="Username",id="login_input")
        yield Input(placeholder="Password",id="password_input",password=True)
        with Horizontal():
            yield Button("Quit",id="quit",variant="error")
            yield Button("Register",id="register",variant="primary")
            yield Button("Login",id="login",variant="success")

class LoginScreen(Screen):

    CSS_PATH = "login.css"
    
    def compose(self) -> ComposeResult:
        yield Label(title_label_text)
        yield Wrapper()

    def on_button_pressed(self, event: Button.Pressed) -> None:
        if(event.button.id == "quit"):
            self.exit()
        if(event.button.id == "login"):
            self.login()
        if(event.button.id == "register"):
            self.register()
    
    def login(self):
        try:
            api_url = "http://localhost:8000/user/login"
            self.app.query_one("#message").remove_class("hidden")
            username = self.app.query_one("#login_input").value
            password = self.app.query_one("#password_input").value
            json_data = {
                'password':password,
                'username':username
            }
            response = requests.post(api_url,json=json_data)
            if response.status_code == 200:
                self.app.query_one("#message").update(loged_text)
                self.app.query_one("#error").update("")
                token = response.json()['token']
                self.app.load_gamemode(f"Berer {token}")
            else:
                self.app.query_one("#message").update(wrong_password_label_text)
                self.app.query_one("#error").update(wrong_password_text)
            
        except:
            self.app.query_one("#message").update("Server error")
            self.app.query_one("#error").update("Did someone forgot to turn on server?")




    def register(self):
        try:
            api_url = "http://localhost:8000/user/register"
            self.app.query_one("#message").remove_class("hidden")
            username = self.app.query_one("#login_input").value
            password = self.app.query_one("#password_input").value
            json_data = {
                'password':password,
                'username':username
            }
            response = requests.post(api_url,json=json_data)
            if response.status_code == 201:
                self.app.query_one("#message").update(registered_text)
                self.app.query_one("#error").update("")
            else:
                self.app.query_one("#message").update(username_taken_label_text)
                self.app.query_one("#error").update(username_taken_text)
        except:
            self.app.query_one("#message").update("Server error")
            self.app.query_one("#error").update("Did someone forgot to turn on server?")

                

    def exit(self):
        self.app.exit()


