import { EligibleSelfServeConfirm } from './eligible-self-serve-confirm.component';
import { EligibleSelfServeSupportForm } from './eligible-self-serve-support-form.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'confirm', pathMatch: 'full' },
  { path: 'confirm', component: EligibleSelfServeConfirm },
  { path: 'support-form', component: EligibleSelfServeSupportForm }
];
