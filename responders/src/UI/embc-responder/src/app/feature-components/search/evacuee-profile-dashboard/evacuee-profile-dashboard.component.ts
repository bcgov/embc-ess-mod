import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { StatusDefinitionDialogComponent } from 'src/app/shared/components/dialog-components/status-definition-dialog/status-definition-dialog.component';
import { VerifyEvacueeDialogComponent } from 'src/app/shared/components/dialog-components/verify-evacuee-dialog/verify-evacuee-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import * as globalConst from '../../../core/services/global-constants';

@Component({
  selector: 'app-evacuee-profile-dashboard',
  templateUrl: './evacuee-profile-dashboard.component.html',
  styleUrls: ['./evacuee-profile-dashboard.component.scss']
})
export class EvacueeProfileDashboardComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  /**
   * Open the dialog with definition of
   * profile status
   */
  openStatusDefinition(): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: StatusDefinitionDialogComponent
      },
      height: '530px',
      width: '580px'
    });
  }

  /**
   * Verifies the evacuee
   */
  verifyEvacuee(): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: VerifyEvacueeDialogComponent
        },
        height: '580px',
        width: '620px'
      })
      .afterClosed()
      .subscribe((value) => {
        console.log(value);
        if (value === 'verified') {
          this.openSuccessModal(globalConst.successfulVerification);
        }
      });
  }

  /**
   * Open the dialog to indicate evacuee has been successfully
   * verified
   *
   * @param text Text to be displayed
   */
  openSuccessModal(text: string) {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        text
      },
      height: '230px',
      width: '530px'
    });
  }
}
