import { HttpResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { ErrorDialogService } from './error-dialog/error-dialog.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private errorDialogService: ErrorDialogService, private zone: NgZone) { }

  handleError(error: Error): void {

    this.zone.run(() =>
      this.errorDialogService.openDialog(
        error.message || 'Undefined client error'
      ));

    console.error('Error from global error handler', error);
  }

}
