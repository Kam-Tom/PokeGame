import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { UserData } from '../../models/user.model';
import { Router } from '@angular/router';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-minigames',
  templateUrl: './minigames.component.html',
  styleUrl: './minigames.component.css'
})
export class MinigamesComponent implements OnInit {

  private userData:UserData;
  private TOTAL_POKEMONS:number = 1017;
  popout:boolean;

  constructor(private userService: UserService,private pokemonService: PokemonService,private router: Router) {}

  ngOnInit(): void {
    this.userService.getGameData().subscribe(
      {next:(value) => {
        this.userData = value;
      },
      error: (e) => {
        console.log('ERROR ' + e.error.message);
      }
    })

  }
  getData(dataNr:number) : number
  {
    let value = 0;
    if(this.userData)
    {
      for(let i=1;i<10;i++)
        value += this.userData[`gen${i}Score`][dataNr];
    }

    return value/this.TOTAL_POKEMONS;
  }
  getVSScore() : number
  {
    return this.userData?.vsScore ?? 0;
  }

  onStart(gameMode:string): void
  {
    this.router.navigate([`/${gameMode}`]);
  }
  
  onBack()
  {
    this.userService.unregister();
    this.router.navigate([`/login`]);
  }

  onDeleteAccount()
  {
    this.pokemonService.clearPokemonsData();
    this.userService.unregister();
    this.router.navigate([`/login`]);
  }

}
