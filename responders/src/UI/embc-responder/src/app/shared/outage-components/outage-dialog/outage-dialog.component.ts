import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { OutageInformation } from 'src/app/core/api/models';

@Component({
  selector: 'app-outage-dialog',
  templateUrl: './outage-dialog.component.html',
  styleUrls: ['./outage-dialog.component.scss']
})
export class OutageDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { message: OutageInformation; time: string },
    public dialogRef: MatDialogRef<OutageDialogComponent>
  ) {}

  public close(): void {
    this.dialogRef.close();
  }
}
