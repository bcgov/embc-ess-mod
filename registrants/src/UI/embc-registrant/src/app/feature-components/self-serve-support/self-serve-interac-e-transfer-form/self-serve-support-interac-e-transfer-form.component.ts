import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ETransferDetailsForm } from '../self-serve-support.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ETransferNotificationPreference } from 'src/app/core/model/e-transfer-notification-preference.model';
import { ProfileDataService } from '../../profile/profile-data.service';
import { IMaskDirective } from 'angular-imask';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-self-serve-support-interac-e-transfer-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    IMaskDirective
  ],
  templateUrl: './self-serve-support-interac-e-transfer-form.component.html',
  styleUrls: [
    '../self-serve-support-form.component.scss',
    './self-serve-support-interac-e-transfer-form.component.scss'
  ]
})
export class SelfServeSupportInteracETransfterFormComponent implements OnInit {
  ETransferNotificationPreference = ETransferNotificationPreference;

  @Input() eTransferDetailsForm: FormGroup<ETransferDetailsForm>;

  eTransferNotificationPreferenceOptions = Object.values(ETransferNotificationPreference);
  readonly phoneMask = { mask: '000-000-0000' };

  hasEmailAddressOnFile = false;
  hasPhoneOnFile = false;

  constructor(
    public profileDataService: ProfileDataService,
    private customValidation: CustomValidationService
  ) {}

  ngOnInit() {
    const profile = this.profileDataService.getProfile();

    this.eTransferDetailsForm.controls.recipientName.setValue(
      `${profile.personalDetails.firstName ?? ''} ${profile.personalDetails.lastName ?? ''}`
    );

    this.eTransferDetailsForm.valueChanges.subscribe({
      next: (eTransferDetails) => {
        if (
          [ETransferNotificationPreference.Email, ETransferNotificationPreference.EmailAndMobile].includes(
            eTransferDetails.notificationPreference
          ) &&
          this.eTransferDetailsForm.controls.useEmailOnFile.value === false
        ) {
          this.eTransferDetailsForm.controls.eTransferEmail.enable({ emitEvent: false });
          this.eTransferDetailsForm.controls.confirmEmail.enable({ emitEvent: false });
        } else {
          this.eTransferDetailsForm.controls.eTransferEmail.disable({ emitEvent: false });
          this.eTransferDetailsForm.controls.confirmEmail.disable({ emitEvent: false });
        }

        if (
          [ETransferNotificationPreference.Mobile, ETransferNotificationPreference.EmailAndMobile].includes(
            eTransferDetails.notificationPreference
          ) &&
          this.eTransferDetailsForm.controls.useMobileOnFile.value === false
        ) {
          this.eTransferDetailsForm.controls.eTransferMobile.enable({ emitEvent: false });
          this.eTransferDetailsForm.controls.confirmMobile.enable({ emitEvent: false });
        } else {
          this.eTransferDetailsForm.controls.eTransferMobile.disable({ emitEvent: false });
          this.eTransferDetailsForm.controls.confirmMobile.disable({ emitEvent: false });
        }

        if (
          ETransferNotificationPreference.Mobile === eTransferDetails.notificationPreference &&
          !this.hasEmailAddressOnFile
        ) {
          this.eTransferDetailsForm.controls.contactEmail.enable({ emitEvent: false });
          this.eTransferDetailsForm.controls.confirmContactEmail.enable({ emitEvent: false });
        } else {
          this.eTransferDetailsForm.controls.contactEmail.disable({ emitEvent: false });
          this.eTransferDetailsForm.controls.confirmContactEmail.disable({ emitEvent: false });
        }
      }
    });

    // @NOTE: adding it directly in the form group is not populating `control.parent` property of the control
    // which is required in the `compare` validator, adding the `compare` validator after the formgroup initialized
    // keeps the `control.parent` property = the FormGorup(eTransferDetailsForm)
    this.eTransferDetailsForm.controls.confirmEmail.addValidators(
      this.customValidation.compare({ fieldName: 'eTransferEmail' })
    );
    this.eTransferDetailsForm.controls.confirmMobile.addValidators(
      this.customValidation.compare({ fieldName: 'eTransferMobile' })
    );

    if (profile?.contactDetails?.email) this.hasEmailAddressOnFile = true;
    if (profile?.contactDetails?.phone) this.hasPhoneOnFile = true;
  }
}
