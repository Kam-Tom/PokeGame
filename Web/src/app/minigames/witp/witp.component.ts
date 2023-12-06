import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon, PokemonType } from '../../../models/pokemon.model';
import { PokemonService } from '../../pokemon.service';
import { Observable, forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-witp',
  templateUrl: './witp.component.html',
  styleUrl: './witp.component.css'
})
export class WITPComponent implements OnInit {
  page:number = 0;
  MAX_POKEMONS:number = 1017;
  cardsCount:number = 0;
  private cardWidth:number = 250;
  pokemons: Pokemon[] = [];
  loaded : boolean;
  a:boolean = false;
  sortMethod:string = 'noSort';
  showDiscovered:string = 'both';

  
  constructor(private router: Router,private route: ActivatedRoute, private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.cardsCount = Math.floor(window.innerWidth / this.cardWidth);
    this.page = this.cardsCount * 2;
    this.page += Math.floor((parseInt(this.route.snapshot.paramMap.get('id'))-1)/ (this.cardsCount * 2)) * (this.cardsCount * 2) || 0;
    if(this.page > this.MAX_POKEMONS - ( this.cardsCount))
      this.page = this.MAX_POKEMONS;

    this.loaded = false;
    this.getAllPokemons();
    
    
  }

  getAllPokemons()
  {

    this.pokemonService.getAllPokemonData().subscribe({
      next: (data) =>
      {
        this.loaded = true;
        this.pokemons = data;
      }}
    );

  }

  onPokemonClick(secretId:number): void
  {
    this.router.navigate(['/PokemonCard',secretId]);
  }

  onBack(): void
  {
    this.router.navigate([`/Minigames`]);
  }

  onNextPage(dir: number) : void
  {
    this.page += this.cardsCount * 2 * dir;
    if (this.page <= 0)
    {
      this.page = this.MAX_POKEMONS - this.page;
    }
    if(this.page > this.MAX_POKEMONS)
    {
      this.page = this.page - this.MAX_POKEMONS;
    }
  }
  onChangeFilter()
  {

    if(this.showDiscovered == 'no')
      this.showDiscovered = 'yes';
    else if(this.showDiscovered == 'yes')
      this.showDiscovered = 'both';
    else if(this.showDiscovered == 'both')
      this.showDiscovered = 'no';


  }
  onChangeSort()
  {
    if(this.sortMethod == 'desc')
      this.sortMethod = 'asc';
    else if(this.sortMethod == 'asc')
      this.sortMethod = 'noSort';
    else if(this.sortMethod == 'noSort')
      this.sortMethod = 'desc';

  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.cardsCount = Math.floor(window.innerWidth / this.cardWidth);
    this.page = this.cardsCount * 2;
  }
}
