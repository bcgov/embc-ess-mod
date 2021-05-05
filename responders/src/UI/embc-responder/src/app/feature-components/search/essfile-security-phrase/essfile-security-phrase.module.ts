import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EssfileSecurityPhraseComponent } from './essfile-security-phrase.component';
import { MaterialModule } from 'src/app/material.module';
import { EssfileSecurityPhraseComponentRoutingModule } from './essfile-security-phrase-routing.module';

@NgModule({
  declarations: [EssfileSecurityPhraseComponent],
  imports: [
    CommonModule,
    EssfileSecurityPhraseComponentRoutingModule,
    MaterialModule
  ]
})
export class EssfileSecurityPhraseModule {}
