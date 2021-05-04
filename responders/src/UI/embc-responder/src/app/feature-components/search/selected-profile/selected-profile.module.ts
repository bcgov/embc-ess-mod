import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedProfileComponent } from './selected-profile.component';
import { MaterialModule } from 'src/app/material.module';
import { SelectedProfileRoutingModule } from './selected-profile-routing.module';

@NgModule({
  declarations: [SelectedProfileComponent],
  imports: [CommonModule, SelectedProfileRoutingModule, MaterialModule]
})
export class SelectedProfileModule {}
