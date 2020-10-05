import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { CollectionNoticeRoutingModule } from './collection-notice-routing.module';
import { CollectionNoticeComponent } from './collection-notice.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DialogModule } from '../../core/components/dialog/dialog.module'

@NgModule({
  declarations: [
    CollectionNoticeComponent
  ],
  imports: [
    CommonModule,
    CollectionNoticeRoutingModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    DialogModule
  ]
})
export class CollectionNoticeModule { }
