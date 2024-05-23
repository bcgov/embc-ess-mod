import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ViewUserProfileRoutingModule } from './view-user-profile-routing.module';
import { ViewUserProfileComponent } from './view-user-profile.component';

@NgModule({
  imports: [CommonModule, ViewUserProfileRoutingModule, ViewUserProfileComponent],
  providers: [DatePipe]
})
export class ViewUserProfileModule {}
