import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignedCommunityListRoutingModule } from './assigned-community-list-routing.module';
import { AssignedCommunityListComponent } from './assigned-community-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material.module';

@NgModule({
  declarations: [
    AssignedCommunityListComponent
  ],
  imports: [
    CommonModule,
    AssignedCommunityListRoutingModule,
    SharedModule,
    MaterialModule
  ]
})
export class AssignedCommunityListModule { }
