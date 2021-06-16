import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnumToArrayPipe } from './EnumToArray.pipe';
import { MaskTextPipe } from './maskText.pipe';
import { MaskEvacuatedAddressPipe } from './maskEvacuatedAddress.pipe';

@NgModule({
  declarations: [EnumToArrayPipe, MaskEvacuatedAddressPipe, MaskTextPipe],
  imports: [CommonModule],
  exports: [EnumToArrayPipe, MaskEvacuatedAddressPipe, MaskTextPipe]
})
export class CustomPipeModule {}
