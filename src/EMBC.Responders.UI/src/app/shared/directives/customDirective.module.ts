import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NumberCommaDirective } from './number-comma.directive';

@NgModule({
  declarations: [NumberCommaDirective],
  imports: [CommonModule],
  exports: [NumberCommaDirective],
  providers: [DecimalPipe]
})
export class CustomDirectiveModule {}
