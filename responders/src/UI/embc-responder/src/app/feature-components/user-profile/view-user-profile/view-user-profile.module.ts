import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewUserProfileRoutingModule } from './view-user-profile-routing.module';
import { ViewUserProfileComponent } from './view-user-profile.component';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    ViewUserProfileComponent
  ],
  imports: [
    CommonModule,
    ViewUserProfileRoutingModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule
  ]
})
export class ViewUserProfileModule { }
