import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnumToArrayPipe } from './EnumToArray.pipe';
import { MaskTextPipe } from './maskText.pipe';
import { MaskEvacuatedAddressPipe } from './maskEvacuatedAddress.pipe';
import { MaskFullAddressPipe } from './maskFullAddress.pipe';
import { NumberArrayPipe } from './numberArray.pipe';
import { NumberOfNightsPipe } from './numberOfNights.pipe';
import { SupplierContactPipe } from './supplierContact.pipe';
import { NumberOfMealsPipe } from './numberOfMeals.pipe';
import { FlatDateFormatPipe } from './flatDateFormat.pipe';

@NgModule({
  declarations: [
    EnumToArrayPipe,
    MaskEvacuatedAddressPipe,
    MaskTextPipe,
    MaskFullAddressPipe,
    NumberArrayPipe,
    NumberOfNightsPipe,
    SupplierContactPipe,
    NumberOfMealsPipe,
    FlatDateFormatPipe
  ],
  imports: [CommonModule],
  exports: [
    EnumToArrayPipe,
    MaskEvacuatedAddressPipe,
    MaskTextPipe,
    MaskFullAddressPipe,
    NumberArrayPipe,
    NumberOfNightsPipe,
    SupplierContactPipe,
    NumberOfMealsPipe,
    FlatDateFormatPipe
  ]
})
export class CustomPipeModule {}
