import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvacuationFileListComponent } from './evacuation-file-list.component';
import { EvacuationFileListRoutingModule } from './evacuation-file-list-routing.module';
import { EvacuationCardComponent } from '../evacuation-card/evacuation-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    EvacuationFileListComponent,
    EvacuationCardComponent],
  imports: [
    CommonModule,
    EvacuationFileListRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressSpinnerModule
  ]
})
export class EvacuationFileListModule { }
