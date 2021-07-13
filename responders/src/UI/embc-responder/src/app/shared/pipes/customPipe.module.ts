import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnumToArrayPipe } from './EnumToArray.pipe';
import { MaskTextPipe } from './maskText.pipe';
import { MaskEvacuatedAddressPipe } from './maskEvacuatedAddress.pipe';
import { MaskFullAddressPipe } from './maskFullAddress.pipe';

@NgModule({
  declarations: [
    EnumToArrayPipe,
    MaskEvacuatedAddressPipe,
    MaskTextPipe,
    MaskFullAddressPipe
  ],
  imports: [CommonModule],
  exports: [
    EnumToArrayPipe,
    MaskEvacuatedAddressPipe,
    MaskTextPipe,
    MaskFullAddressPipe
  ]
})
export class CustomPipeModule {}
