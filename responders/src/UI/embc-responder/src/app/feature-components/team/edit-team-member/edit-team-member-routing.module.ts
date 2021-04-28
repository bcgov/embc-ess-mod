import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditTeamMemberComponent } from './edit-team-member.component';

const routes: Routes = [{ path: '', component: EditTeamMemberComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditTeamMemberRoutingModule {}
