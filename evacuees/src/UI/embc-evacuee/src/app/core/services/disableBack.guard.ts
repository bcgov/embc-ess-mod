import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate } from '@angular/router';
import { FileSubmissionComponent } from '../../sharedModules/components/file-submission/file-submission.component';
import { DialogService } from './dialog.service';

@Injectable({ providedIn: 'root' })
export class DisableBackGuard implements CanDeactivate<FileSubmissionComponent> {

    constructor(public dialog: MatDialog, public dialogService: DialogService) { }

    canDeactivate(): boolean {
        console.log(window.location.pathname);
        if (window.location.pathname === '/non-verified-registration/file-submission') {
            return true;
        } else {
            this.dialogService.invalidGoBackMessage();

            // this.dialog.open(DialogComponent, {
            //     data: globalConst.invalidGoBackMessage,
            //     height: '220px',
            //     width: '400px'
            // });
            return false;
        }

    }


}
