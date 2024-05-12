import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignedCommunityListRoutingModule } from './assigned-community-list-routing.module';
import { AssignedCommunityListComponent } from './assigned-community-list.component';

@NgModule({
  imports: [CommonModule, AssignedCommunityListRoutingModule, AssignedCommunityListComponent]
})
export class AssignedCommunityListModule {}
