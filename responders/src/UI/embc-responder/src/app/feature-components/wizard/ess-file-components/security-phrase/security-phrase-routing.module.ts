import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityPhraseComponent } from './security-phrase.component';

const routes: Routes = [{ path: '', component: SecurityPhraseComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityPhraseRoutingModule {}
