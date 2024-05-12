import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import { UserProfileRoutingModule } from './user-profile-routing.module';

@NgModule({
  imports: [CommonModule, UserProfileRoutingModule, UserProfileComponent],
  providers: [DatePipe]
})
export class UserProfileModule {}
