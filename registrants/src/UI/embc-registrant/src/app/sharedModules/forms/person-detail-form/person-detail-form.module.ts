import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonDetailFormComponent } from '../person-detail-form/person-detail-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { DirectivesModule } from '../../../core/directives/directives.module';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [PersonDetailFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DirectivesModule,
    MatCheckboxModule,
    TextMaskModule
  ],
  exports: [PersonDetailFormComponent]
})
export class PersonDetailFormModule {}
