import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogContent } from '../../model/dialog-content.model';

@Component({
  selector: 'app-info.dialog',
  templateUrl: 'information-dialog.html',
  styleUrls: ['./information-dialog.scss']
})
export class InformationDialog {
  title: string;
  content: DialogContent;
  constructor(public dialogRef: MatDialogRef<InformationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.content.title;
    this.content = data.content;
  }

  close() {
    this.dialogRef.close();
  }
}