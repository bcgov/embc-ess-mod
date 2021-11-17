import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InviteErrorComponent } from './invite-error.component';

const routes: Routes = [{ path: '', component: InviteErrorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InviteErrorRoutingModule {}
