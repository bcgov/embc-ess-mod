import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { tap } from 'rxjs';
import { RegistrationsService } from 'src/app/core/api/services';
import { ConfigService } from 'src/app/core/services/config.service';
import { SharedModule } from 'src/app/shared/shared.module';

export type AccessEntity = 'profile' | 'essFile';

export interface AccessReasonData {
  accessEntity: AccessEntity;
  entityId: string;
}

@Component({
  selector: 'app-access-reason-dialog',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatRadioModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  template: `
    <div style="padding: 24px">
      <div style="display: flex">
        <p>
          <b> Please specify the reason for accessing this {{ label[dialogData.accessEntity] }}.</b>
          <br />
          Please note, evacuee information shall only be accessed for the purposes of providing support to evacuees
        </p>
        <button class="close-image close-button-style" mat-icon-button aria-label="Close" mat-dialog-close>
          <img src="/assets/images/close.svg" height="20" width="20" />
          <img src="/assets/images/close_onhover.svg" height="20" width="20" />
        </button>
      </div>

      <mat-dialog-content style="padding: 24px">
        <mat-radio-group
          class="primary-radio-group"
          style="display: flex; flex-direction: column"
          [formControl]="accessReasonControl"
        >
          <mat-radio-button
            style="margin-bottom: 16px"
            *ngFor="let reason of accessReasons$ | async"
            [value]="reason[0]"
          >
            {{ reason[1] }}
          </mat-radio-button>
        </mat-radio-group>
        <p style="color: red" *ngIf="accessReasonControl.touched && accessReasonControl.invalid">
          Please select a reason before proceeding
        </p>
        <app-loader class="spinner" [showLoader]="showLoader" [strokeWidth]="10" [diameter]="50" [color]="color">
        </app-loader>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button cdkFocusInitial mat-button class="button-s" [mat-dialog-close]="false">Cancel</button>
        <button mat-button class="button-p" (click)="proceed()">
          Proceed to {{ buttonLabel[dialogData.accessEntity] }}
          <app-loader
            *ngIf="showButtonLoader"
            class="spinner"
            [showLoader]="showButtonLoader"
            [strokeWidth]="10"
            [diameter]="30"
            [color]="color"
          >
          </app-loader>
        </button>
      </mat-dialog-actions>
    </div>
  `
})
export class AccessReasonGateDialogComponent {
  showLoader = true;
  showButtonLoader = false;
  accessReasons$ = this.configService.getAccessReasons().pipe(tap(() => (this.showLoader = false)));

  accessReasonControl = new FormControl<number | null>(null, [Validators.required]);

  color = '#169BD5';

  label: Record<AccessEntity, string> = {
    profile: 'evacuee profile',
    essFile: 'ESS File'
  };

  buttonLabel: Record<AccessEntity, string> = {
    profile: 'Profile',
    essFile: 'ESS File'
  };

  constructor(
    private dialog: MatDialogRef<AccessReasonGateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: AccessReasonData,
    private configService: ConfigService,
    private registrationsService: RegistrationsService
  ) {}

  proceed() {
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
    } else if (this.dialogData.accessEntity === 'essFile') {
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
