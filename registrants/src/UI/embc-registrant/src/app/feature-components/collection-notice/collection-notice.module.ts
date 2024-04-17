import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

import { CollectionNoticeRoutingModule } from './collection-notice-routing.module';
import { CollectionNoticeComponent } from './collection-notice.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';

@NgModule({
  declarations: [CollectionNoticeComponent],
  imports: [
    CommonModule,
    CollectionNoticeRoutingModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ]
})
export class CollectionNoticeModule {}
