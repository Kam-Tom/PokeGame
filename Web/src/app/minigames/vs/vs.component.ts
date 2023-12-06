import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonService } from '../../pokemon.service';

@Component({
  selector: 'app-vs',
  templateUrl: './vs.component.html',
  styleUrl: './vs.component.css'
})
export class VSComponent implements OnInit {
  firstId:number = 1;
  secondId:number = 2;
  streak:number = 0;
  winner:string;
  winnerStats:string;
  loserStats:string;
  popout:boolean;

  constructor(private router: Router,private pokemonService:PokemonService) {}
  
  ngOnInit(): void {
    this.getNextDuo();
  }

  get Winner():string
  {
    return this.winner;
  }
  get WinnerStats():string
  {
    return this.winnerStats;
  }
  get PopoutButtonText():string
  {
    if(this.streak > 0)
      return 'YEA';
    else
      return 'OH';
  }
  get LoserStats():string
  {
    return this.loserStats;
  }

  getNextDuo()
  {
    this.firstId = Math.floor(Math.random() * 1016) + 1;
    this.secondId = Math.floor(Math.random() * 1016) + 1;

    while(this.secondId == this.firstId)
      this.secondId = Math.floor(Math.random() * 1016) + 1;
  }

  onBack(): void
  {
    this.router.navigate([`/Minigames`]);
  }

  onChoose(guess:number): void
  {
    this.pokemonService.fightPokemons(this.firstId,this.secondId,guess).subscribe(
      {
        next:(data) =>
        {

          this.winner = data['winner']['name'];
          this.loserStats = `Attack:${data['loser']['attack']} Defense:${data['loser']['defense']}`;
          this.winnerStats = `Attack:${data['winner']['attack']} Defense:${data['winner']['defense']}`;
          
          if(data['yourGuess'] == true)
            this.streak += 1
          else        
            this.streak = 0;


          this.popout = true;
          
          this.getNextDuo();
        },
        error:(e) =>
        {
          this.streak = 0;
        }
      }
    );
  }
  onPopoutClick()
  {
    this.popout = false;
  }

}
