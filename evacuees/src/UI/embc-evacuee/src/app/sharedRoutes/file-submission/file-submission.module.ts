import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileSubmissionRoutingModule } from './file-submission-routing.module';
import { FileSubmissionComponent } from './file-submission.component';


@NgModule({
  declarations: [
    FileSubmissionComponent
  ],
  imports: [
    CommonModule,
    FileSubmissionRoutingModule
  ]
})
export class FileSubmissionModule { }
