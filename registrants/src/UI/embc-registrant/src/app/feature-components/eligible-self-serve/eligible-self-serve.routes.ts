import { EligibleSelfServeConfirmComponent } from './eligible-self-serve-confirm.component';
import { EligibleSelfServeSupportFormComponent } from './eligible-self-serve-support-form.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'confirm', pathMatch: 'full' },
  { path: 'confirm', component: EligibleSelfServeConfirmComponent },
  { path: 'support-form', component: EligibleSelfServeSupportFormComponent }
];
