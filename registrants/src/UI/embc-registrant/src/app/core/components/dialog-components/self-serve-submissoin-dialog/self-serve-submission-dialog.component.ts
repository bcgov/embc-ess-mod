import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SubmitSupportsRequest } from '../../../api/models';
import { ETransferNotificationPreference } from '../../../model/e-transfer-notification-preference.model';

@Component({
  selector: 'app-ess-file-self-serve-submitssion-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './self-serve-submission-dialog.component.html',
  styleUrl: './self-serve-submission-dialog.component.scss'
})
export class SelfServeSubmissionDialogComponent {
  ETransferNotificationPreference = ETransferNotificationPreference;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      totalAmount: number;
      eTransferDetails: SubmitSupportsRequest['eTransferDetails'];
      notificationPreference: ETransferNotificationPreference;
    }
  ) {}
}
