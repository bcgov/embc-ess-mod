import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionNoticeComponent } from './collection-notice.component';

const routes: Routes = [{ path: '', component: CollectionNoticeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionNoticeRoutingModule {}
