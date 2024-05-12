import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from 'angular-imask';
import { EvacueeNameSearchRoutingModule } from './evacuee-name-search-routing.module';
import { EvacueeNameSearchComponent } from './evacuee-name-search.component';

@NgModule({
  imports: [CommonModule, EvacueeNameSearchRoutingModule, ReactiveFormsModule, IMaskModule, EvacueeNameSearchComponent]
})
export class EvacueeNameSearchModule {}
