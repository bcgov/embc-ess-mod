import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateMaskDirective } from './DateMask.directive';
import { PhoneMaskDirective } from './PhoneMask.directive';

@NgModule({
  declarations: [DateMaskDirective, PhoneMaskDirective],
  imports: [CommonModule],
  exports: [DateMaskDirective, PhoneMaskDirective]
})
export class DirectivesModule {}
