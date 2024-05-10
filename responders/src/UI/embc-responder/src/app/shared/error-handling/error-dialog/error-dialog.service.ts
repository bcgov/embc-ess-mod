import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ErrorDialogComponent } from './error-dialog.component';

@Injectable()
export class ErrorDialogService {
  private opened = false;

  constructor(private dialog: MatDialog) {}

  public openDialog(message: string, status?: number): void {
    if (!this.opened) {
      this.opened = true;
      const dialogRef = this.dialog.open(ErrorDialogComponent, {
        data: { message, status },
        maxHeight: '100%',
        width: '540px',
        maxWidth: '100%',
        disableClose: true,
        hasBackdrop: true
      });

      dialogRef.afterClosed().subscribe((d) => {
        this.opened = false;
      });
    }
  }
}
