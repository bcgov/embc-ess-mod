import { Routes } from '@angular/router';
import { SelfServeSupportConfirmComponent } from './self-serve-support-confirm/self-serve-support-confirm.component';
import { SelfServeSupportFormComponent } from './self-serve-support-form.component';
import { disableGaurdFn } from 'src/app/core/services/disableBack.guard.fn';

export const routes: Routes = [
  { path: '', redirectTo: 'confirm', pathMatch: 'full' },
  {
    path: 'confirm',
    component: SelfServeSupportConfirmComponent,
    canDeactivate: [disableGaurdFn(['/verified-registration/needs-assessment'])]
  },
  { path: 'support-form', component: SelfServeSupportFormComponent }
];
