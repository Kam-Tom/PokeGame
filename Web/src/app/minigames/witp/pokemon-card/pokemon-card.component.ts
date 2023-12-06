import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../../pokemon.service';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Pokemon, PokemonType } from '../../../../models/pokemon.model';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.css'
})
export class PokemonCardComponent implements OnInit {
  secretId: number;
  imageUrl: string;
  pokemonForm: FormGroup;
  pokemon:Pokemon;
  discoveryProgress:number;

  constructor(private pokemonService: PokemonService, private route: ActivatedRoute,private router: Router) {}
  
  ngOnInit() {
    this.secretId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.loadImage();
    this.loadData();

    this.pokemonForm = new FormGroup({
      id: new FormControl(
        null,
        [Validators.min(0), Validators.max(1017)]

      ),
      name: new FormControl(
        null,
        [this.regexValidator(/^[a-zA-Z]+$/)]
      ),
      generation: new FormControl(
        null,
        [Validators.min(0), Validators.max(9)]
      )
    })
  }

  loadImage()
  {
    this.pokemonService.getPokemonImg(this.secretId).subscribe(
      {
        next: (data) =>
        {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.imageUrl = reader.result as string;
          };
          reader.readAsDataURL(data);
        },
        error: (e) =>
        {
          this.imageUrl = 'assets/no-img.png';
        }
      }
    )
  }
 
  loadData()
  {
    this.pokemonService.getPokemonData(this.secretId).subscribe(
      {
        next: (data) =>
        {
          this.pokemon = data;
          this.updateForm();
        },
        error: (e) =>
        {
          this.pokemon = undefined;
        }
      }
    )
  }
  updateForm(): void 
  {
    this.discoveryProgress = 0;

    if(this.pokemon?.Id){
      this.pokemonForm.get('id').setValue(this.pokemon.Id);
      this.pokemonForm.get('id').disable();
      this.discoveryProgress += 0.33;
    }
    else if(this.pokemonForm.get('id').touched)
      this.pokemonForm.get('id').setErrors({'incorrect': true});
    
    if(this.pokemon?.Name){
      this.pokemonForm.get('name').setValue(this.pokemon.Name);
      this.pokemonForm.get('name').disable();
      this.discoveryProgress += 0.33;
    }
    else if(this.pokemonForm.get('name').touched)
      this.pokemonForm.get('name').setErrors({'incorrect': true});

    if(this.pokemon?.Generation){
      this.pokemonForm.get('generation').setValue(this.pokemon.Generation);
      this.pokemonForm.get('generation').disable();
      this.discoveryProgress += 0.34;
    }
    else if(this.pokemonForm.get('generation').touched)
      this.pokemonForm.get('generation').setErrors({'incorrect': true});
    
  }
  onBack(): void
  {
    this.router.navigate([`/WITP/${this.secretId}`]);
  }
  
  onSubmit(): void
  {
    const pokemon:Pokemon = new Pokemon
    (
      this.secretId,
      this.pokemonForm.get('id').value,
      this.pokemonForm.get('name').value,
      this.pokemonForm.get('generation').value,
      PokemonType.None,
      PokemonType.None
      );
    this.pokemonService.updatePokemon(pokemon).subscribe(
      {
        next: () =>
        {
          this.loadData();
          this.loadImage();
        },
      }
    )
  }
  regexValidator(regex: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = regex.test(control.value);
      return forbidden ? null : { regex: { value: control.value } };
    };
  }


}
