import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName][appGSTMask]'
})
export class GSTCodeDirective {
  constructor(public ngControl: NgControl) {}

  @HostListener('ngModelChange', ['$event'])
  onModelChange(evt) {
    this.onInputChange(evt, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(evt) {
    this.onInputChange(evt.target.value, true);
  }

  //   Char 1-9 (Main Number): Must be whole number between 0 - 9

  // Char 10-11(Program Identifier): Must be RT

  // Char 12-15 (Reference Number): Must be whole number between 0 - 9

  onInputChange(evt, backspace) {
    let newVal = evt.replace(/\D/g, '');
    if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }
    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 9) {
      newVal = newVal.replace(/^(\d{0,9})/, '$1');
    } else if (newVal.length <= 11) {
      newVal = newVal.replace(/^(\d{0,9})/, '$1-RT-');
    } else if (newVal.length <= 13) {
      newVal = newVal.replace(/^(\d{0,9})(\d{0,4})/, '$1-RT-$2');
    } else {
      newVal = newVal.substring(0, 13);
      newVal = newVal.replace(/^(\d{0,9})(\d{0,4})/, '$1-RT-$2');
      this.ngControl.control.setValue(newVal);
    }
    this.ngControl.valueAccessor.writeValue(newVal);
  }
}
