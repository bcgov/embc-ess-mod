import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'responder-access',
    loadChildren: () => import('./feature-components/responder-access/responder-access.module')
      .then(m => m.ResponderAccessModule)
  },
  {
    path: 'electronic-agreement',
    loadChildren: () => import('./feature-components/electronic-agreement/electronic-agreement.module')
      .then(m => m.ElectronicAgreementModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
