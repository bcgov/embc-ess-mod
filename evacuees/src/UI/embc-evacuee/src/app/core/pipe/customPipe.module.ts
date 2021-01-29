import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnumToArrayPipe } from './EnumToArray.pipe';
import { MaskTextPipe } from './maskText.pipe';
import { CustomDate } from './customDate.pipe';


@NgModule({
  declarations: [
    EnumToArrayPipe,
    MaskTextPipe,
    CustomDate
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EnumToArrayPipe,
    MaskTextPipe,
    CustomDate
  ]
})
export class CustomPipeModule { }
