import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { EditRoutingModule } from './edit-routing.module';
import { ComponentWrapperModule } from '../../sharedModules/components/component-wrapper/component-wrapper.module';
import { EditComponent } from './edit.component';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { RestrictionFormModule } from '../../sharedModules/forms/restriction-form/restriction-form.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [EditComponent],
  imports: [
    CommonModule,
    EditRoutingModule,
    ComponentWrapperModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    RestrictionFormModule,
    CoreModule
  ]
})
export class EditModule {}
