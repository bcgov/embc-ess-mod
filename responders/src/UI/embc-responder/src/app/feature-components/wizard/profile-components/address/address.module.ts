import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressRoutingModule } from './address-routing.module';
import { AddressComponent } from './address.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [CommonModule, AddressRoutingModule, MaterialModule, ReactiveFormsModule, SharedModule, AddressComponent]
})
export class AddressModule {}
