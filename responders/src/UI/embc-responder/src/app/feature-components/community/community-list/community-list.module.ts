import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityListRoutingModule } from './community-list-routing.module';
import { CommunityListComponent } from './community-list.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    CommunityListComponent
  ],
  imports: [
    CommonModule,
    CommunityListRoutingModule,
    SharedModule
  ]
})
export class CommunityListModule { }
