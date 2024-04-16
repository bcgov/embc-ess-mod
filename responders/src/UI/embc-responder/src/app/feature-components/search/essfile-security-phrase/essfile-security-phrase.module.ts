import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EssfileSecurityPhraseComponent } from './essfile-security-phrase.component';
import { MaterialModule } from 'src/app/material.module';
import { EssfileSecurityPhraseComponentRoutingModule } from './essfile-security-phrase-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SecurityPhraseCardComponent } from './security-phrase-card/security-phrase-card.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [EssfileSecurityPhraseComponent, SecurityPhraseCardComponent],
  imports: [
    CommonModule,
    EssfileSecurityPhraseComponentRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class EssfileSecurityPhraseModule {}
