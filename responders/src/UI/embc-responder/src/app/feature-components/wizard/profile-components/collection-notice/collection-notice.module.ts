import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectionNoticeRoutingModule } from './collection-notice-routing.module';
import { CollectionNoticeComponent } from './collection-notice.component';

@NgModule({
  declarations: [CollectionNoticeComponent],
  imports: [CommonModule, CollectionNoticeRoutingModule]
})
export class CollectionNoticeModule {}
