import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileSubmissionRoutingModule } from './file-submission-routing.module';
import { FileSubmissionComponent } from './file-submission.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [FileSubmissionComponent],
  imports: [CommonModule, FileSubmissionRoutingModule, MatCardModule, MatButtonModule, MatDialogModule, CoreModule]
})
export class FileSubmissionModule {}
