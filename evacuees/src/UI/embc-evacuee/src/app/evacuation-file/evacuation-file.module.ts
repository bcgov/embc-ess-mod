import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EvacuationFileRoutingModule } from './evacuation-file-routing.module';
import { EvacuationFileComponent } from './evacuation-file.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    EvacuationFileComponent
  ],
  imports: [
    CommonModule,
    EvacuationFileRoutingModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class EvacuationFileModule { }
