import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnumToArrayPipe } from './EnumToArray.pipe';
import { MaskTextPipe } from './maskText.pipe';

@NgModule({
  declarations: [
    EnumToArrayPipe,
    MaskTextPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EnumToArrayPipe,
    MaskTextPipe
  ]
})
export class CustomPipeModule { }
