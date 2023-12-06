import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PokemonService } from '../../../pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon-card-thumbnail',
  templateUrl: './pokemon-card-thumbnail.component.html',
  styleUrl: './pokemon-card-thumbnail.component.css'
})
export class PokemonCardThumbnailComponent implements OnChanges {
  @Input() discoveryProcentage:number = 0;
  @Input() name:string = '???';
  @Input() secretId:number = 0;
  isLoading: boolean = false;
  imageUrl: string;
  private apiColl: Subscription;

  constructor(private pokemonService: PokemonService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.secretId) {
      this.loadImage();
    }
  }

  loadImage()
  {
    this.isLoading = true;
    this.apiColl?.unsubscribe();

    this.apiColl = this.pokemonService.getPokemonImg(this.secretId).subscribe(
      {
        next: (data) =>
        {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.isLoading = false;
            this.imageUrl = reader.result as string;
          };
          reader.readAsDataURL(data);
        },
        error: (e) =>
        {
          this.isLoading = false;
          this.imageUrl = 'assets/no-img.png';
        }
      }
    )
  }

}
