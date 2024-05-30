import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectionNoticeRoutingModule } from './collection-notice-routing.module';
import { CollectionNoticeComponent } from './collection-notice.component';

@NgModule({
  imports: [CommonModule, CollectionNoticeRoutingModule, CollectionNoticeComponent]
})
export class CollectionNoticeModule {}
