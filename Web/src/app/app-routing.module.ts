import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MinigamesComponent } from './minigames/minigames.component';
import { WITPComponent } from './minigames/witp/witp.component';
import { VSComponent } from './minigames/vs/vs.component';
import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { UserService } from "./user.service";
import { PokemonCardComponent } from './minigames/witp/pokemon-card/pokemon-card.component';

const isLogged: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(UserService).isLogged() ? true : inject(Router).createUrlTree(['/login']);
    };


const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'Minigames', component: MinigamesComponent , canActivate: [isLogged]},
  { path: 'WITP/:id', component: WITPComponent, canActivate: [isLogged] },
  { path: 'WITP', component: WITPComponent, canActivate: [isLogged] },
  { path: 'VS', component: VSComponent, canActivate: [isLogged] },
  { path: 'PokemonCard/:id', component: PokemonCardComponent, canActivate: [isLogged] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

