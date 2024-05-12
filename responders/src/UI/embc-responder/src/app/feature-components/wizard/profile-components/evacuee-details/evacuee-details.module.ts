import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from 'angular-imask';
import { EvacueeDetailsRoutingModule } from './evacuee-details-routing.module';
import { EvacueeDetailsComponent } from './evacuee-details.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
    imports: [CommonModule, EvacueeDetailsRoutingModule, MaterialModule, ReactiveFormsModule, IMaskModule, EvacueeDetailsComponent]
})
export class EvacueeDetailsModule {}
