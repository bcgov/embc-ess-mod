import { AsyncPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { tap } from 'rxjs';
import { RegistrationsService } from 'src/app/core/api/services';
import { ConfigService } from 'src/app/core/services/config.service';
import { AppLoaderComponent } from 'src/app/shared/components/app-loader/app-loader.component';

export type AccessEntity = 'profile' | 'essFile' | 'secretWord';

export interface AccessReasonData {
  accessEntity: AccessEntity;
  entityId: string;
}

@Component({
  selector: 'app-access-reason-gate-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatRadioModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    AppLoaderComponent,
    AsyncPipe
  ],
  templateUrl: './access-reason-gate-dialog.component.html'
})
export class AccessReasonGateDialogComponent {
  showLoader = true;
  showButtonLoader = false;
  accessReasons$ = this.configService.getAccessReasons().pipe(tap(() => (this.showLoader = false)));

  accessReasonControl = new FormControl<number | null>(null, [Validators.required]);

  color = '#169BD5';

  label: Record<AccessEntity, string> = {
    profile: 'evacuee profile',
    essFile: 'ESS File',
    secretWord: 'ESS File'
  };

  buttonLabel: Record<AccessEntity, string> = {
    profile: 'Profile',
    essFile: 'ESS File',
    secretWord: 'ESS File'
  };

  constructor(
    private dialog: MatDialogRef<AccessReasonGateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: AccessReasonData,
    private configService: ConfigService,
    private registrationsService: RegistrationsService
  ) {}

  proceed() {
    if (this.showButtonLoader) return;

    this.accessReasonControl.markAsTouched();

    if (this.accessReasonControl.invalid) return;

    if (this.dialogData.accessEntity === 'profile') {
      this.showButtonLoader = true;

      this.registrationsService
        .registrationsAuditRegistrantAccess({
          body: { accessReasonId: this.accessReasonControl.value },
          registrantId: this.dialogData.entityId
        })
        .subscribe({
          next: () => {
            this.showButtonLoader = false;
            this.dialog.close(true);
          },
          complete: () => {
            this.showButtonLoader = false;
          }
        });
    } else if (this.dialogData.accessEntity === 'essFile' || this.dialogData.accessEntity === 'secretWord') {
      this.showButtonLoader = true;
      this.registrationsService
        .registrationsAuditFileAcccess({
          body: { accessReasonId: this.accessReasonControl.value },
          fileId: this.dialogData.entityId
        })
        .subscribe({
          next: () => {
            this.showButtonLoader = false;
            this.dialog.close(true);
          },
          complete: () => {
            this.showButtonLoader = false;
          }
        });
    }
  }
}
