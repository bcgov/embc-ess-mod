import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnumToArrayPipe } from './EnumToArray.pipe';
import { MaskTextPipe } from './maskText.pipe';
import { CustomDate } from './customDate.pipe';
import { ArrayContains } from './arrayContains.pipe';


@NgModule({
  declarations: [
    EnumToArrayPipe,
    MaskTextPipe,
    CustomDate,
    ArrayContains
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EnumToArrayPipe,
    MaskTextPipe,
    CustomDate,
    ArrayContains
  ]
})
export class CustomPipeModule { }
