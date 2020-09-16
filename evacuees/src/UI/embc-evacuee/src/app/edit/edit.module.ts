import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EditRoutingModule } from './edit-routing.module';
import { EvacueeProfileFormsModule } from '../core/components/evacuee-profile-forms.module';
import { EditComponent } from './edit.component';


@NgModule({
  declarations: [
    EditComponent
  ],
  imports: [
    CommonModule,
    EditRoutingModule,
    EvacueeProfileFormsModule,
    ReactiveFormsModule
  ]
})
export class EditModule { }
