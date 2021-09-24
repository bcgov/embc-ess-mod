import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnumToArrayPipe } from './EnumToArray.pipe';
import { MaskTextPipe } from './maskText.pipe';
import { CustomDate } from './customDate.pipe';
import { ArrayContains } from './arrayContains.pipe';
import { ArrayValueOf } from './arrayValueOf.pipe';
import { MaskEvacuatedAddressPipe } from './maskEvacuatedAddress.pipe';

@NgModule({
  declarations: [
    EnumToArrayPipe,
    MaskTextPipe,
    CustomDate,
    ArrayContains,
    ArrayValueOf,
    MaskEvacuatedAddressPipe
  ],
  imports: [CommonModule],
  exports: [
    EnumToArrayPipe,
    MaskTextPipe,
    CustomDate,
    ArrayContains,
    ArrayValueOf,
    MaskEvacuatedAddressPipe
  ]
})
export class CustomPipeModule {}
