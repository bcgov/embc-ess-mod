import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { EditRoutingModule } from './edit-routing.module';
import { ComponentWrapperModule } from '../../components/component-wrapper/component-wrapper.module';
import { EditComponent } from './edit.component';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RestrictionFormModule } from '../../forms/restriction-form/restriction-form.module';

@NgModule({
  declarations: [
    EditComponent
  ],
  imports: [
    CommonModule,
    EditRoutingModule,
    ComponentWrapperModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    RestrictionFormModule
  ]
})
export class EditModule { }
