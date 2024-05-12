import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material.module';
import { AssignedCommunityTableComponent } from './assigned-community-table.component';

@NgModule({
    imports: [CommonModule, SharedModule, MaterialModule, AssignedCommunityTableComponent],
    exports: [AssignedCommunityTableComponent]
})
export class AssignedCommunityTableModule {}
