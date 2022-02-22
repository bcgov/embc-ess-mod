import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EssfileSecurityPhraseComponent } from './essfile-security-phrase.component';

const routes: Routes = [
  { path: '', component: EssfileSecurityPhraseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EssfileSecurityPhraseComponentRoutingModule {}
