import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName][appDateMask]'
})
export class DateMaskDirective {
  constructor(
    public ngControl: NgControl,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('ngModelChange', ['$event'])
  onModelChange(evt): void {
    this.onInputChange(evt, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(evt): void {
    this.onInputChange(evt.target.value, true);
  }

  onInputChange(evt, backspace): void {
    const current: string = this.el.nativeElement.value;
    const start = this.el.nativeElement.selectionStart;
    const end = this.el.nativeElement.selectionEnd;
    let newVal = evt.replace(/\D/g, '');
    if (backspace && newVal.length <= 4) {
      newVal = newVal.substring(0, newVal.length - 1);
    }
    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 2) {
      newVal = newVal.replace(/^(\d{0,2})/, '$1');
    } else if (newVal.length <= 4) {
      newVal = newVal.replace(/^(\d{0,2})(\d{0,2})/, '$1/$2');
    } else if (newVal.length <= 8) {
      newVal = newVal.replace(/^(\d{0,2})(\d{0,2})(\d{0,4})/, '$1/$2/$3');
    } else {
      newVal = newVal.substring(0, 8);
      newVal = newVal.replace(/^(\d{0,2})(\d{0,2})(\d{0,4})/, '$1/$2/$3');
      this.ngControl.control.setValue(newVal);
    }
    this.ngControl.valueAccessor.writeValue(newVal);
    if (current.length > start) {
      this.renderer
        .selectRootElement(this.el)
        .nativeElement.setSelectionRange(start, end);
    }
  }
}
