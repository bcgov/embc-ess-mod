import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate } from '@angular/router';
import { FileSubmissionComponent } from '../../feature-components/file-submission/file-submission.component';
import { DialogComponent } from '../components/dialog/dialog.component';
import { DialogService } from './dialog.service';
import * as globalConst from '../services/globalConstants';
import { InformationDialogComponent } from '../components/dialog-components/information-dialog/information-dialog.component';

@Injectable({ providedIn: 'root' })
export class DisableBackGuard
  implements CanDeactivate<FileSubmissionComponent>
{
  constructor(public dialog: MatDialog, public dialogService: DialogService) {}

  canDeactivate(): boolean {
    console.log(window.location.pathname);
    if (
      window.location.pathname === '/non-verified-registration/file-submission'
    ) {
      return true;
    } else {
      this.dialog.open(DialogComponent, {
        data: {
          component: InformationDialogComponent,
          content: globalConst.invalidGoBack
        },
        height: '220px',
        width: '400px'
      });
      return false;
    }
  }
}
