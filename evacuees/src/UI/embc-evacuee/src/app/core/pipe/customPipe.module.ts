import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnumToArrayPipe } from './EnumToArray.pipe';

@NgModule({
  declarations: [
    EnumToArrayPipe
  ],
  imports: [
    CommonModule
  ], 
  exports: [
    EnumToArrayPipe
  ]
})
export class CustomPipeModule { }
