import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/services/auth.guard';
import { LogoutComponent } from './sharedModules/components/logout/logout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'registration-method',
    pathMatch: 'full',
  },
  {
    path: 'registration-method',
    loadChildren: () =>
      import('./login-page/login-page.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'non-verified-registration',
    loadChildren: () =>
      import(
        './non-verified-registration/non-verified-registration.module'
      ).then((m) => m.NonVerifiedRegistrationModule),
  },
  {
    path: 'verified-registration',
    loadChildren: () =>
      import('./verified-registration/verified-registration.module').then(
        (m) => m.VerifiedRegistrationModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'logout',
    component: LogoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
