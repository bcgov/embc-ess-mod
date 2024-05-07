import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SupportsService } from 'src/app/core/api/services';
import { NeedsAssessmentService } from '../needs-assessment/needs-assessment.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-eligible-self-serve-opt-out-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="row">
      <div class="col-10">
        <h1 mat-dialog-title>Support Update Required</h1>
      </div>
      <div class="col-2" style="text-align: right;">
        <button class="close-image close-button-style" mat-icon-button aria-label="Close" mat-dialog-close>
          <img src="/assets/images/close.svg" height="20" width="20" />
          <img src="/assets/images/close_onhover.svg" height="20" width="20" />
        </button>
      </div>
    </div>

    <mat-dialog-content>
      <p>
        <b>You currently have no supports selected.</b> Please take a moment to update your support details to select
        the necessary assistance for you and your household while you are evacuated.
      </p>
      <p>
        If you no longer require support or would prefer to proceed with referrals, you can

        <a class="highlightText" style="cursor: pointer" (click)="optOut()">
          click here to opt out and receive supports via referral.
        </a>
      </p>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button class="button-p" mat-button mat-dialog-close>Edit Support Details</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: var(--size-3);
      }
    `
  ]
})
export class EligibleSelfServeTotalAmountZeroDialogComponent {
  isProcessing = false;
  essFileId = this.needsAssessmentService.getVerifiedEvacuationFileNo();

  constructor(
    private dialogRef: MatDialogRef<EligibleSelfServeTotalAmountZeroDialogComponent>,
    private needsAssessmentService: NeedsAssessmentService,
    private supportsService: SupportsService,
    private router: Router
  ) {}

  optOut() {
    this.isProcessing = true;
    this.supportsService.supportsOptOut({ evacuationFileId: this.essFileId }).subscribe({
      next: () => {
        this.isProcessing = false;
        this.dialogRef.close();
        this.gotoDashboard();
      }
    });
  }

  gotoDashboard() {
    this.router.navigate(['/verified-registration/dashboard']);
  }
}
