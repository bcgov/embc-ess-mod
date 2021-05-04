import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedEssfileComponent } from './selected-essfile.component';
import { SelectedEssfileComponentRoutingModule } from './selected-essfile-routing.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [SelectedEssfileComponent],
  imports: [CommonModule, SelectedEssfileComponentRoutingModule, MaterialModule]
})
export class SelectedEssfileModule {}
