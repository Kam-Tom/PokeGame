import { Injectable } from '@angular/core';
import { Pokemon, PokemonType } from '../models/pokemon.model';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, tap } from 'rxjs';


interface PokemonJson {
  secretId: string;
  id: string;
  name: string;
  generation: string;
  mainType: string;
  secondType: string | null;
  attack: string;
  defense: string;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  pokemons:Pokemon[];
  MAX_POKEMONS: number = 1017;

  constructor(private http: HttpClient) 
  {
    this.pokemons = [];
  }
  clearPokemonsData()
  {
    this.pokemons = [];
  }

  getPokemonImg(secretId:number) {
    return this.http.get(`http://localhost:8000/pokemon/img/${secretId}`,
    {
      responseType:'blob',
      params: {
        resolution: 500,
      },
    });
  }

  getPokemonData(secretId:number) {

    return this.http.get<PokemonJson>(`http://localhost:8000/pokemon/data/${secretId}`)
    .pipe(
      map((pokemonJson: PokemonJson) => {
        const pokemon = new Pokemon(
          +pokemonJson.secretId,
          +pokemonJson.id,
          pokemonJson.name,
          +pokemonJson.generation,
          PokemonType[pokemonJson.mainType as keyof typeof PokemonType],
          PokemonType[pokemonJson.secondType as keyof typeof PokemonType],
          +pokemonJson.attack,
          +pokemonJson.defense
          )

          this.pokemons[pokemon.SecretId-1] = pokemon;
          
          return pokemon;
        })
      
    );
  }

  getAllPokemonData() : Observable<Pokemon[]>
  {
    if(this.pokemons.length > 0)
    {
      return of(this.pokemons);
    }
    else
    {
      const secretIdsToFetch = Array.from({ length: 1017 }, (_, i) => i + 1);
      
      const observables = secretIdsToFetch.map(secretId => this.getPokemonData(secretId));
      
      return forkJoin(observables);
    }
  }
  getWildPokemonImg(secretId: number)
  {
    return this.http.get(`http://localhost:8000/pokemon/wild/img/${secretId}`,
    {
      responseType:'blob',
      params: {
        resolution: 500,
      },
    });
  }
  getWildPokemonName(secretId: number)
  {
    return this.http.get(`http://localhost:8000/pokemon/wild/name/${secretId}`);
  }
  fightPokemons(firstId : number,secondId:number,guess:number)
  {
    return this.http.post(`http://localhost:8000/pokemon/wild/fight`,
    {
      firstSecretId:firstId,
      secondSecretId:secondId,
      guess:guess,
    });
  }
  updatePokemon(pokemon:Pokemon) {
    return this.http.put(`http://localhost:8000/pokemon/${pokemon.SecretId}`,
    {
      id: pokemon.Id,
      name: pokemon.Name,
      generation:pokemon.Generation,
      mainType:pokemon.MainType,
      secondType:pokemon.SecondType
      
    })
  }

}