import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignedCommunityManagementRoutingModule } from './assigned-community-management-routing.module';
import { AssignedCommunityManagementComponent } from './assigned-community-management.component';

@NgModule({
  imports: [CommonModule, AssignedCommunityManagementRoutingModule, AssignedCommunityManagementComponent]
})
export class AssignedCommunityManagementModule {}
