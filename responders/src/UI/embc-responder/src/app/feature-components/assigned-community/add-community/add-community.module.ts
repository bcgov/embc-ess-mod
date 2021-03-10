import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCommunityRoutingModule } from './add-community-routing.module';
import { AddCommunityComponent } from './add-community.component';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material.module';

@NgModule({
  declarations: [
    AddCommunityComponent
  ],
  imports: [
    CommonModule,
    AddCommunityRoutingModule,
    SharedModule,
    MaterialModule
  ]
})
export class AddCommunityModule { }
