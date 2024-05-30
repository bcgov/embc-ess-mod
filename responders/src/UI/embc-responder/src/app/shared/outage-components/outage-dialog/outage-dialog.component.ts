import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { OutageInformation } from 'src/app/core/api/models';
import { DatePipe } from '@angular/common';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-outage-dialog',
  templateUrl: './outage-dialog.component.html',
  styleUrls: ['./outage-dialog.component.scss'],
  standalone: true,
  imports: [MatIconButton, MatDialogContent, MatDialogActions, DatePipe]
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
