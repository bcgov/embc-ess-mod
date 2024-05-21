import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { DialogContent } from '../../model/dialog-content.model';

@Component({
  selector: 'app-info.dialog',
  templateUrl: 'information-dialog.component.html',
  styleUrls: ['./information-dialog.component.scss']
})
export class InformationDialogComponent {
  title: string;
  content: DialogContent;
  constructor(
    public dialogRef: MatDialogRef<InformationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.content.title;
    this.content = data.content;
  }

  close() {
    this.dialogRef.close();
  }
}
