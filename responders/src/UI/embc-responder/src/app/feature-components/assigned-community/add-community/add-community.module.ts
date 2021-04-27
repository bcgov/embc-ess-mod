import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCommunityRoutingModule } from './add-community-routing.module';
import { AddCommunityComponent } from './add-community.component';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material.module';
import { AssignedCommunityTableModule } from '../assigned-community-table/assigned-community-table.module';

@NgModule({
  declarations: [AddCommunityComponent],
  imports: [
    CommonModule,
    AddCommunityRoutingModule,
    SharedModule,
    MaterialModule,
    AssignedCommunityTableModule
  ]
})
export class AddCommunityModule {}
