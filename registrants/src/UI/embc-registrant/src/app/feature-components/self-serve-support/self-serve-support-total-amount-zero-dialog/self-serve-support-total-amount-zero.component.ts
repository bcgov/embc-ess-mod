import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SupportsService } from 'src/app/core/api/services';
import { NeedsAssessmentService } from '../../needs-assessment/needs-assessment.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-eligible-self-serve-opt-out-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './self-serve-support-total-amount-zero.component.html',
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
