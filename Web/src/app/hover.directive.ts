import { Directive, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHover]'
})
export class HoverDirective {
  @HostBinding('style.opacity') opacity: string;
  @Input('appHover') hoverStrenght: number = 70;
  constructor() { }

  @HostListener('mouseleave') mouseleave(eventData: Event) 
  {
    this.opacity = '100%';

  }
  @HostListener('mouseenter') mouseover(eventData: Event) 
  {
    this.opacity = this.hoverStrenght+'%';

  }

}
