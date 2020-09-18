import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateMaskDirective } from './DateMask.directive';

@NgModule({
  declarations: [
    DateMaskDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DateMaskDirective
  ]
})
export class DirectiveModule { }
