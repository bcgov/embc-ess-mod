import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddTeamMemberComponent } from './add-team-member.component';

const routes: Routes = [{ path: '', component: AddTeamMemberComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddTeamMemberRoutingModule {}
