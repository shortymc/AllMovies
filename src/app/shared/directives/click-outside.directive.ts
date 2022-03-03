import {Directive, HostListener, EventEmitter, Output} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective {
  inside = false;
  @HostListener('click')
  clicked(): void {
    this.inside = true;
  }
  @HostListener('document:click')
  clickedOut(): void {
    if (!this.inside) {
      this.outside.emit(true);
    }
    this.inside = false;
  }

  @Output()
  outside = new EventEmitter<boolean>();

  constructor() {}
}
