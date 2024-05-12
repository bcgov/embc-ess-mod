import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NumberCommaDirective } from './number-comma.directive';

@NgModule({
  imports: [CommonModule, NumberCommaDirective],
  exports: [NumberCommaDirective],
  providers: [DecimalPipe]
})
export class CustomDirectiveModule {}
