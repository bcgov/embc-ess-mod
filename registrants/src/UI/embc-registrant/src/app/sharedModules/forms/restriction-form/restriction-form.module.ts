import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestrictionFormComponent } from './restriction-form.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';

@NgModule({
  declarations: [RestrictionFormComponent],
  imports: [CommonModule, MatCardModule, MatButtonModule, MatRadioModule, ReactiveFormsModule, MatFormFieldModule],
  exports: [RestrictionFormComponent]
})
export class RestrictionFormModule {}
