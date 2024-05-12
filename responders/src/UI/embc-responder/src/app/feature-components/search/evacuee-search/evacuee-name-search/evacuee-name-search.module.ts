import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from 'angular-imask';
import { EvacueeNameSearchRoutingModule } from './evacuee-name-search-routing.module';
import { EvacueeNameSearchComponent } from './evacuee-name-search.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        EvacueeNameSearchRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        SharedModule,
        IMaskModule,
        EvacueeNameSearchComponent
    ]
})
export class EvacueeNameSearchModule {}
