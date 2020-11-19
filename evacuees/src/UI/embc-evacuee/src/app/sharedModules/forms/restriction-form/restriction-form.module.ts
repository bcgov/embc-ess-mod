import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestrictionFormComponent } from './restriction-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RestrictionFormComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule
  ],
  exports: [RestrictionFormComponent]
})
export class RestrictionFormModule { }
