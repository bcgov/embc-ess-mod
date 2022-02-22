import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileSubmissionRoutingModule } from './file-submission-routing.module';
import { FileSubmissionComponent } from './file-submission.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [FileSubmissionComponent],
  imports: [
    CommonModule,
    FileSubmissionRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    CoreModule
  ]
})
export class FileSubmissionModule {}
