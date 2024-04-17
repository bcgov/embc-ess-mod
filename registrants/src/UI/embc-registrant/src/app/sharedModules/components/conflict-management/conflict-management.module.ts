import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConflictManagementRoutingModule } from './conflict-management-routing.module';
import { ConflictManagementComponent } from './conflict-management.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { ComponentWrapperModule } from '../../components/component-wrapper/component-wrapper.module';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { CustomPipeModule } from '../../../core/pipe/customPipe.module';
import { CoreModule } from '../../../core/core.module';

@NgModule({
  declarations: [ConflictManagementComponent],
  imports: [
    CommonModule,
    ConflictManagementRoutingModule,
    MatStepperModule,
    MatCardModule,
    MatButtonModule,
    ComponentWrapperModule,
    MatSelectModule,
    MatAutocompleteModule,
    CustomPipeModule,
    CoreModule
  ]
})
export class ConflictManagementModule {}
