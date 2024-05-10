import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityPhraseComponent } from './security-phrase.component';
import { SecurityPhraseRoutingModule } from './security-phrase-routing.module';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';

@NgModule({
  declarations: [SecurityPhraseComponent],
  imports: [
    CommonModule,
    SecurityPhraseRoutingModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CustomPipeModule
  ]
})
export class SecurityPhraseModule {}
