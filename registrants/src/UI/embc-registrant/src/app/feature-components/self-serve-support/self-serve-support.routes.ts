import { SelfServeSupportConfirmComponent } from './self-serve-support-confirm/self-serve-support-confirm.component';
import { SelfServeSupportFormComponent } from './self-serve-support-form.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'confirm', pathMatch: 'full' },
  { path: 'confirm', component: SelfServeSupportConfirmComponent },
  { path: 'support-form', component: SelfServeSupportFormComponent }
];
