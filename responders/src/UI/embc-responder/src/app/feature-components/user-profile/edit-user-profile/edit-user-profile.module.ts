import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditUserProfileComponent } from './edit-user-profile.component';
import { EditUserProfileRoutingModule } from './edit-user-profile-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [EditUserProfileComponent],
  imports: [
    CommonModule,
    EditUserProfileRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    TextMaskModule
  ]
})
export class EditUserProfileModule {}
