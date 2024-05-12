import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectionNoticeRoutingModule } from './collection-notice-routing.module';
import { CollectionNoticeComponent } from './collection-notice.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
    imports: [CommonModule, CollectionNoticeRoutingModule, MaterialModule, CollectionNoticeComponent]
})
export class CollectionNoticeModule {}
