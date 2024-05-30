import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ReviewModule } from '../../../../feature-components/review/review.module';

@NgModule({
  imports: [CommonModule, ProfileRoutingModule, ReviewModule, ProfileComponent]
})
export class ProfileModule {}
