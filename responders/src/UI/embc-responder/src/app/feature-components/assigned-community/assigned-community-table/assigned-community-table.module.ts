import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material.module';
import { AssignedCommunityTableComponent } from './assigned-community-table.component';

@NgModule({
  declarations: [AssignedCommunityTableComponent],
  imports: [CommonModule, SharedModule, MaterialModule],
  exports: [AssignedCommunityTableComponent]
})
export class AssignedCommunityTableModule {}
