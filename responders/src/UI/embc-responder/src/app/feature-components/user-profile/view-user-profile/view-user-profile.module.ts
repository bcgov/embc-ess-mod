import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ViewUserProfileRoutingModule } from './view-user-profile-routing.module';
import { ViewUserProfileComponent } from './view-user-profile.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
    imports: [CommonModule, ViewUserProfileRoutingModule, MaterialModule, ViewUserProfileComponent],
    providers: [DatePipe]
})
export class ViewUserProfileModule {}
