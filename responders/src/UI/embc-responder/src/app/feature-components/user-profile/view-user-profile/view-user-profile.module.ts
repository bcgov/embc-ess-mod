import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewUserProfileRoutingModule } from './view-user-profile-routing.module';
import { ViewUserProfileComponent } from './view-user-profile.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [
    ViewUserProfileComponent
  ],
  imports: [
    CommonModule,
    ViewUserProfileRoutingModule,
    MaterialModule
  ]
})
export class ViewUserProfileModule { }
