import { ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorDialogService } from './error-dialog/error-dialog.service';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { CommonModule } from '@angular/common';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

@NgModule({
  declarations: [ErrorDialogComponent, AccessDeniedComponent],
  imports: [CommonModule]
})
export class ErrorHandlingModule {
  public static forRoot(): ModuleWithProviders<ErrorHandlingModule> {
    return {
      ngModule: ErrorHandlingModule,
      providers: [
        ErrorDialogService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true
        }
      ]
    };
  }
}
