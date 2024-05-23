import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EssfileSecurityPhraseComponent } from './essfile-security-phrase.component';

import { EssfileSecurityPhraseComponentRoutingModule } from './essfile-security-phrase-routing.module';

import { SecurityPhraseCardComponent } from './security-phrase-card/security-phrase-card.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    EssfileSecurityPhraseComponentRoutingModule,
    ReactiveFormsModule,
    EssfileSecurityPhraseComponent,
    SecurityPhraseCardComponent
  ]
})
export class EssfileSecurityPhraseModule {}
