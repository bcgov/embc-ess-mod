import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { EditRoutingModule } from './edit-routing.module';

import { EditComponent } from './edit.component';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { CoreModule } from '../../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    EditRoutingModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    CoreModule,
    EditComponent
  ]
})
export class EditModule {}
