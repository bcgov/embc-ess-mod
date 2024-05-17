import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SelfServeSupportOptOutDialogComponent } from '../self-serve-support-opt-out-dialog/self-serve-support-opt-out-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { DialogContent } from 'src/app/core/model/dialog-content.model';
import { InformationDialogComponent } from 'src/app/core/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';
import * as globalConst from '../../../core/services/globalConstants';
import { SupportsService } from 'src/app/core/api/services';
import { NeedsAssessmentService } from '../../needs-assessment/needs-assessment.service';

@Component({
  standalone: true,
  selector: 'app-self-serve-confirm',
  templateUrl: './self-serve-support-confirm.component.html',
  imports: [MatCardModule, MatButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['../self-serve-support-form.component.scss']
})
export class SelfServeSupportConfirmComponent {
  essFileId = this.needsAssessmentService.getVerifiedEvacuationFileNo();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private supportService: SupportsService,
    private needsAssessmentService: NeedsAssessmentService
  ) {}

  optOutSelfServe() {
    this.dialog
      .open(SelfServeSupportOptOutDialogComponent, {
        width: '700px'
      })
      .afterClosed()
      .subscribe((optOut) => {
        if (optOut)
          this.supportService.supportsOptOut({ evacuationFileId: this.essFileId }).subscribe({
            next: () => {
              this.gotoDashboard();
            }
          });
      });
  }

  gotoSelfServeSupport() {
    this.router.navigate(['../support-form'], { relativeTo: this.route });
  }

  gotoDashboard() {
    this.router.navigate(['/verified-registration/dashboard']);
  }

  openInteracETransferDialog() {
    this.openInfoDialog(globalConst.interacETransferDialog);
  }

  openInteracOptOutDialog() {
    this.openInfoDialog(globalConst.interacOptOut);
  }

  private openInfoDialog(dialog: DialogContent) {
    return this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: dialog
      },
      maxWidth: '400px'
    });
  }
}
