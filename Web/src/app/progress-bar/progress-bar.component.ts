import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css'
})
export class ProgressBarComponent {

  @Input() total: number = 1;
  @Input() current: number = 0;

  calculateProgress(): number 
  {
    return this.total !== 0 ? (this.current / this.total) * 100 : 0;
  }
}
