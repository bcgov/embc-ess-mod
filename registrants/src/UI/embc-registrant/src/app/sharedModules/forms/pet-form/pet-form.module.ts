import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetFormComponent } from './pet-form.component';

import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

@NgModule({
  declarations: [PetFormComponent],
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  exports: [PetFormComponent]
})
export class PetFormModule {}
