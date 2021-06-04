import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConflictManagementRoutingModule } from './conflict-management-routing.module';
import { ConflictManagementComponent } from './conflict-management.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ComponentWrapperModule } from '../../components/component-wrapper/component-wrapper.module';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
