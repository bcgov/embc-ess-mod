import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HouseholdMembersComponent } from './household-members.component';

const routes: Routes = [{ path: '', component: HouseholdMembersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HouseholdMembersRoutingModule {}
