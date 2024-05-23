import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityPhraseComponent } from './security-phrase.component';
import { SecurityPhraseRoutingModule } from './security-phrase-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    SecurityPhraseRoutingModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    SecurityPhraseComponent
  ]
})
export class SecurityPhraseModule {}
