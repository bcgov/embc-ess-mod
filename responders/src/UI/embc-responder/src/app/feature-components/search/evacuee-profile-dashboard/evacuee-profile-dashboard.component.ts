import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
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
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private cacheService: CacheService,
    private evacueeSessionService: EvacueeSessionService
  ) {}

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
          component: VerifyEvacueeDialogComponent,
          content: globalConst.verifyEvacueeProfile
        },
        height: '580px',
        width: '620px'
      })
      .afterClosed()
      .subscribe((value) => {
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
  openSuccessModal(content: DialogContent): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content
      },
      height: '230px',
      width: '530px'
    });
  }

  createNewESSFile(): void {
    this.cacheService.set(
      'wizardOpenedFrom',
      '/responder-access/search/evacuee-profile-dashboard'
    );
    this.evacueeSessionService.setWizardType(WizardType.NewEssFile);
    this.router.navigate(['/ess-wizard'], {
      queryParams: { type: WizardType.NewEssFile },
      queryParamsHandling: 'merge'
    });
  }

  editProfile(): void {
    this.cacheService.set(
      'wizardOpenedFrom',
      '/responder-access/search/evacuee-profile-dashboard'
    );
    this.evacueeSessionService.setWizardType(WizardType.EditRegistration);

    this.router.navigate(['/ess-wizard'], {
      queryParams: { type: WizardType.EditRegistration },
      queryParamsHandling: 'merge'
    });
  }
}
