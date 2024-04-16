import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvacueeSearchRoutingModule } from './evacuee-search-routing.module';
import { EvacueeSearchComponent } from './evacuee-search.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchOptionsComponent } from './search-options/search-options.component';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';

@NgModule({
  declarations: [EvacueeSearchComponent, SearchOptionsComponent],
  imports: [
    CommonModule,
    EvacueeSearchRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    CustomPipeModule
  ]
})
export class EvacueeSearchModule {}
