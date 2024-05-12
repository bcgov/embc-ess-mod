import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCommunityRoutingModule } from './add-community-routing.module';
import { AddCommunityComponent } from './add-community.component';

@NgModule({
  imports: [CommonModule, AddCommunityRoutingModule, AddCommunityComponent]
})
export class AddCommunityModule {}
