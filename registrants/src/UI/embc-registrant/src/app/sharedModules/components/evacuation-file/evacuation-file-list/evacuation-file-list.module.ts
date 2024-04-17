import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvacuationFileListComponent } from './evacuation-file-list.component';
import { EvacuationFileListRoutingModule } from './evacuation-file-list-routing.module';
import { EvacuationCardComponent } from '../evacuation-card/evacuation-card.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [EvacuationFileListComponent, EvacuationCardComponent],
  imports: [CommonModule, CoreModule, EvacuationFileListRoutingModule, MatCardModule, MatButtonModule, MatTabsModule]
})
export class EvacuationFileListModule {}
