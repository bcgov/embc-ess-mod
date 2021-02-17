import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityManagementRoutingModule } from './community-management-routing.module';
import { CommunityManagementComponent } from './community-management.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [
    CommunityManagementComponent
  ],
  imports: [
    CommonModule,
    CommunityManagementRoutingModule,
    MaterialModule
  ]
})
export class CommunityManagementModule { }
