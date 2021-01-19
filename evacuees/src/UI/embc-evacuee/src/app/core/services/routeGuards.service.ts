import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate } from '@angular/router';
import { NonVerifiedRegistrationComponent } from 'src/app/non-verified-registration/non-verified-registration.component';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';
import * as globalConst from './globalConstants';

@Injectable()
export class SubmitFileCanDeactivateGuardService implements CanDeactivate<NonVerifiedRegistrationComponent> {

    constructor(public dialog: MatDialog) { }

    canDeactivate(): boolean {

        this.dialog.open(DialogComponent, {
            data: globalConst.invalidGoBackMessage,
            height: '220px',
            width: '400px'
        });
        return false;
    }
}
