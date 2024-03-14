import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HouseholdMembersPetsComponent } from './household-members-pets.component';

const routes: Routes = [{ path: '', component: HouseholdMembersPetsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HouseholdMembersPetsRoutingModule {}
