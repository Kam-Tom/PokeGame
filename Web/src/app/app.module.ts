import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { MinigamesComponent } from './minigames/minigames.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WITPComponent } from './minigames/witp/witp.component';
import { VSComponent } from './minigames/vs/vs.component';
import { PokemonCardThumbnailComponent } from './minigames/witp/pokemon-card-thumbnail/pokemon-card-thumbnail.component';
import { PokemonCardComponent } from './minigames/witp/pokemon-card/pokemon-card.component';
import { PokemonVSCardComponent } from './minigames/vs/pokemon-vscard/pokemon-vscard.component';
import { UserService } from './user.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './auth-interceptor.service';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { PokemonSortPipe } from './pokemon-sort.pipe';
import { HoverDirective } from './hover.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MinigamesComponent,
    WITPComponent,
    VSComponent,
    PokemonCardThumbnailComponent,
    PokemonCardComponent,
    PokemonVSCardComponent,
    ProgressBarComponent,
    PokemonSortPipe,
    HoverDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
