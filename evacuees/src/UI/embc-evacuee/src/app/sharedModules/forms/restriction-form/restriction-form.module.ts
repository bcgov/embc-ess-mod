import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestrictionFormComponent } from './restriction-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [RestrictionFormComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatFormFieldModule
  ],
  exports: [RestrictionFormComponent]
})
export class RestrictionFormModule {}
