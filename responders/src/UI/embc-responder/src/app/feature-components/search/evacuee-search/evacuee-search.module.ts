import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvacueeSearchRoutingModule } from './evacuee-search-routing.module';
import { EvacueeSearchComponent } from './evacuee-search.component';
import { EvacueeIdVerifyComponent } from './evacuee-id-verify/evacuee-id-verify.component';
import { EvacueeNameSearchComponent } from './evacuee-name-search/evacuee-name-search.component';
import { EvacueeSearchResultsComponent } from './evacuee-search-results/evacuee-search-results.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { TextMaskModule } from 'angular2-text-mask';


@NgModule({
  declarations: [
    EvacueeSearchComponent,
    EvacueeIdVerifyComponent,
    EvacueeNameSearchComponent,
    EvacueeSearchResultsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EvacueeSearchRoutingModule,
    MatCardModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatInputModule,
    TextMaskModule
  ],
  exports: [
    EvacueeIdVerifyComponent,
    EvacueeNameSearchComponent,
    EvacueeSearchResultsComponent
  ]
})
export class EvacueeSearchModule { }
