import { HighlightDirective } from './highlight.directive';
import { ElementRef, Renderer2 } from '@angular/core/';

let elementRef: ElementRef;
let renderer2: Renderer2;

describe('HighlightDirective', () => {
  it('should create an instance', () => {
    const directive = new HighlightDirective(elementRef, renderer2);
    expect(directive).toBeTruthy();
  });
});
