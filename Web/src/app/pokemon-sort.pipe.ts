import { Pipe, PipeTransform } from '@angular/core';
import { Pokemon } from '../models/pokemon.model';

@Pipe({
  name: 'pokemonSort',
  pure:true
})
export class PokemonSortPipe implements PipeTransform {

  transform(pokemons: Pokemon[], start: number, end: number, direction: string, discovered:string): Pokemon[] {
    if (!Array.isArray(pokemons)) {
      return pokemons;
    }

    let dir:number = 1;
    if(direction.toLowerCase() == 'desc')
      dir = -1;
    

    if(direction.toLowerCase() != 'nosort')
    {
      pokemons = pokemons.sort((a: Pokemon, b: Pokemon) => {


        if(a.Id == 0 && b.Id != 0)
          return 1;
        else if(a.Id != 0 && b.Id == 0)
          return -1;

        if (a.SecretId > b.SecretId) 
          return -1* dir;
        else if (a.SecretId < b.SecretId) 
          return 1* dir;
        else 
          return 0;
      });
    }
   

    if(discovered == 'yes')
      pokemons = pokemons.filter(pokemon => pokemon.Name);
    if(discovered == 'no')
      pokemons = pokemons.filter(pokemon => !pokemon.Name);

    pokemons = pokemons.slice(start,end);
    
    return pokemons;
  }

}
