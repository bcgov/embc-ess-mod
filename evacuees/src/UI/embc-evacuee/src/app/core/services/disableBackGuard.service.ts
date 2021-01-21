import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate } from '@angular/router';
import { FileSubmissionComponent } from '../../sharedModules/components/file-submission/file-submission.component'
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';
import * as globalConst from './globalConstants';

@Injectable()
export class CanDeactivateGuardService implements CanDeactivate<FileSubmissionComponent> {

    constructor(public dialog: MatDialog) { }

    canDeactivate(): boolean {

        if (window.location.href === 'http://localhost:4200/non-verified-registration/fileSubmission') {
            return true;
        } else {
            this.dialog.open(DialogComponent, {
                data: globalConst.invalidGoBackMessage,
                height: '220px',
                width: '400px'
            });
            return false;
        }

    }
}
