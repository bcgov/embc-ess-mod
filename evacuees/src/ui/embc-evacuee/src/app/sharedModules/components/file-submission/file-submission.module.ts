import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileSubmissionRoutingModule } from './file-submission-routing.module';
import { FileSubmissionComponent } from './file-submission.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    FileSubmissionComponent
  ],
  imports: [
    CommonModule,
    FileSubmissionRoutingModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class FileSubmissionModule { }
