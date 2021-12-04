import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNonrendu]'
})
export class NonrenduDirective {

  constructor(el:ElementRef) {
    el.nativeElement.style.color = 'red';
  }

}
