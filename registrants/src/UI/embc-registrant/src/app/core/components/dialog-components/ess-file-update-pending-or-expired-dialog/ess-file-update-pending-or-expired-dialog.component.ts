import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-ess-file-update-pending-or-expired-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './ess-file-update-pending-or-expired-dialog.component.html',
  styleUrls: ['./ess-file-update-pending-or-expired-dialog.component.scss']
})
export class EssFileUpdatePendingOrExpiredDialogComponent {}
