import { Component, Input, SimpleChanges } from '@angular/core';
import { PokemonService } from '../../../pokemon.service';

@Component({
  selector: 'app-pokemon-vscard',
  templateUrl: './pokemon-vscard.component.html',
  styleUrl: './pokemon-vscard.component.css'
})
export class PokemonVSCardComponent {
  @Input() secretId: number;
  isLoading: boolean = false;
  imageUrl: string;
  name: string = "---";

  constructor(private pokemonService:PokemonService) {}

   ngOnInit() {
    this.loadImage();
    this.loadName();

  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.secretId) {
      this.loadImage();
      this.loadName();
    }
  }

  loadImage()
  {
    
    this.pokemonService.getWildPokemonImg(this.secretId).subscribe(
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
  loadName()
  {
    
    this.pokemonService.getWildPokemonName(this.secretId).subscribe(
      {
        next: (data) =>
        {
          this.name = data['name'];
        },
        error: (e) =>
        {
          this.name = '---';
        }
      }
    )
  }
}
