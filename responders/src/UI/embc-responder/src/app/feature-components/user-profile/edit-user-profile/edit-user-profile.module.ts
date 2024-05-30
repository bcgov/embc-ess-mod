import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from 'angular-imask';
import { EditUserProfileComponent } from './edit-user-profile.component';
import { EditUserProfileRoutingModule } from './edit-user-profile-routing.module';

@NgModule({
  imports: [CommonModule, EditUserProfileRoutingModule, ReactiveFormsModule, IMaskModule, EditUserProfileComponent]
})
export class EditUserProfileModule {}
