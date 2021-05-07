import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvacueeSearchRoutingModule } from './evacuee-search-routing.module';
import { EvacueeSearchComponent } from './evacuee-search.component';
import { EvacueeIdVerifyComponent } from './evacuee-id-verify/evacuee-id-verify.component';
import { EvacueeNameSearchComponent } from './evacuee-name-search/evacuee-name-search.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    EvacueeSearchComponent,
    EvacueeIdVerifyComponent,
    EvacueeNameSearchComponent
  ],
  imports: [
    CommonModule,
    EvacueeSearchRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    TextMaskModule,
    SharedModule
  ],
  exports: [EvacueeIdVerifyComponent, EvacueeNameSearchComponent]
})
export class EvacueeSearchModule {}
