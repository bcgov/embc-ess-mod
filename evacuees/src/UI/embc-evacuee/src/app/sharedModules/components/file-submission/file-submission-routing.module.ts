import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileSubmissionComponent } from './file-submission.component';

const routes: Routes = [{ path: '', component: FileSubmissionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileSubmissionRoutingModule {}
