import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { CollectionNoticeRoutingModule } from './collection-notice-routing.module';
import { CollectionNoticeComponent } from './collection-notice.component';


@NgModule({
  declarations: [
    CollectionNoticeComponent
  ],
  imports: [
    CommonModule,
    CollectionNoticeRoutingModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class CollectionNoticeModule { }
