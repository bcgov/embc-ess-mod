import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WizardActivateGuard } from './feature-components/wizard/wizard-activate.guard';
import { WizardDeactivateGuard } from './feature-components/wizard/wizard-deactivate.guard';
import { AccessDeniedComponent } from './shared/error-handling/access-denied/access-denied.component';

const routes: Routes = [
  {
    path: 'responder-access',
    loadChildren: () =>
      import(
        './feature-components/responder-access/responder-access.module'
      ).then((m) => m.ResponderAccessModule)
  },
  {
    path: 'electronic-agreement',
    loadChildren: () =>
      import(
        './feature-components/electronic-agreement/electronic-agreement.module'
      ).then((m) => m.ElectronicAgreementModule)
  },
  {
    path: 'ess-wizard',
    loadChildren: () =>
      import('./feature-components/wizard/wizard.module').then(
        (m) => m.WizardModule
      ),
    canActivate: [WizardActivateGuard],
    canDeactivate: [WizardDeactivateGuard]
  },
  {
    path: 'outage',
    loadChildren: () =>
      import('./feature-components/outage/outage.module').then(
        (m) => m.OutageModule
      )
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      onSameUrlNavigation: 'reload',
      paramsInheritanceStrategy: 'always'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
