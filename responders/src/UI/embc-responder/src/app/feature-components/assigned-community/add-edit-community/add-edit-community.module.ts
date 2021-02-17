import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEditCommunityRoutingModule } from './add-edit-community-routing.module';
import { AddEditCommunityComponent } from './add-edit-community.component';

@NgModule({
  declarations: [
    AddEditCommunityComponent
  ],
  imports: [
    CommonModule,
    AddEditCommunityRoutingModule
  ]
})
export class AddEditCommunityModule { }
