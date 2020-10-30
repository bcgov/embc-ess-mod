import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileSubmissionRoutingModule } from './file-submission-routing.module';
import { FileSubmissionComponent } from './file-submission.component';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    FileSubmissionComponent
  ],
  imports: [
    CommonModule,
    FileSubmissionRoutingModule,
    MatCardModule,
    MatExpansionModule
  ]
})
export class FileSubmissionModule { }
