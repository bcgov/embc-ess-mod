import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-ess-file-update-active-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './ess-file-update-active-dialog.component.html',
  styleUrls: ['./ess-file-update-active-dialog.component.scss']
})
export class EssFileUpdateActiveDialogComponent {
  supportType = this.dialogData.supportWithExtensions ? 'Support Extensions' : 'Supports';

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: { supportWithExtensions: boolean }) {}
}
