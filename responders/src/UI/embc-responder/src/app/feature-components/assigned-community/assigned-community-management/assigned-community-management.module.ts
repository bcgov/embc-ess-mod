import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignedCommunityManagementRoutingModule } from './assigned-community-management-routing.module';
import { AssignedCommunityManagementComponent } from './assigned-community-management.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
    imports: [CommonModule, AssignedCommunityManagementRoutingModule, MaterialModule, AssignedCommunityManagementComponent]
})
export class AssignedCommunityManagementModule {}
