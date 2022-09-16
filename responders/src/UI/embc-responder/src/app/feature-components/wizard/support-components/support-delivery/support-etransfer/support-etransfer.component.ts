import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { SupplierListItemModel } from 'src/app/core/models/supplier-list-item.model';
import { StepSupportsService } from '../../../step-supports/step-supports.service';
import { MatSelectChange } from '@angular/material/select';
import {
  CustomErrorMailMatcher,
  CustomErrorMobileMatcher
} from '../../../profile-components/contact/contact.component';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { AppBaseService } from '../../../../../core/services/helper/appBase.service';
import { CacheService } from '../../../../../core/services/cache.service';
import { WizardType } from '../../../../../core/models/wizard-type.model';

@Component({
  selector: 'app-support-etransfer',
  templateUrl: './support-etransfer.component.html',
  styleUrls: ['./support-etransfer.component.scss']
})
export class SupportEtransferComponent implements OnInit, OnDestroy {
  @Input() supportDeliveryForm: UntypedFormGroup;
  @Input() editFlag: boolean;
  @Input() cloneFlag: boolean;
  @ViewChild('setEmailCheckbox') setEmailCheckbox: MatCheckbox;
  @ViewChild('setMobileCheckbox') setMobileCheckbox: MatCheckbox;
  readonly phoneMask = [
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ];

  supplierList: SupplierListItemModel[];
  filteredOptions: Observable<SupplierListItemModel[]>;
  showTextField = false;
  selectedSupplierItem: SupplierListItemModel;
  showSupplierFlag = false;
  showLoader = false;
  color = '#169BD5';

  notificationPreferences = ['Email', 'Mobile', 'Email & Mobile'];
  emailMatcher = new CustomErrorMailMatcher();
  mobileMatcher = new CustomErrorMobileMatcher();

  preferenceSubscription: Subscription;
  showEmailCheckBox = false;
  showMobileCheckBox = false;
  emailOnFile: string;
  previousEmail: string;
  mobileOnFile: string;
  previousMobile: string;

  constructor(
    public stepSupportsService: StepSupportsService,
    private appBaseService: AppBaseService,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    if (
      this.editFlag &&
      this.appBaseService.wizardProperties.wizardType ===
        WizardType.ExtendSupports
    ) {
      this.cloneFlag = true;
    }
    this.emailOnFile =
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext?.contactDetails?.email;
    this.previousEmail = this.cacheService.get('previousEmail');
    if (!this.cloneFlag && (this.emailOnFile || this.previousEmail))
      this.showEmailCheckBox = true;

    this.mobileOnFile =
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext?.contactDetails?.phone;
    this.previousMobile = this.cacheService.get('previousMobile');

    if (!this.cloneFlag && (this.mobileOnFile || this.previousMobile))
      this.showMobileCheckBox = true;

    this.preferenceSubscription = this.supportDeliveryForm
      ?.get('notificationPreference')
      .valueChanges.subscribe((pref) => {
        if (!pref.includes('Email')) {
          this.supportDeliveryForm?.get('notificationEmail').patchValue('');
          this.supportDeliveryForm
            ?.get('notificationConfirmEmail')
            .patchValue('');
        }
        if (!pref.includes('Mobile')) {
          this.supportDeliveryForm?.get('notificationMobile').patchValue('');
          this.supportDeliveryForm
            ?.get('notificationConfirmMobile')
            .patchValue('');
        }
        this.supportDeliveryForm
          ?.get('notificationEmail')
          .updateValueAndValidity();
        this.supportDeliveryForm
          ?.get('notificationConfirmEmail')
          .updateValueAndValidity();
        this.supportDeliveryForm
          ?.get('notificationMobile')
          .updateValueAndValidity();
        this.supportDeliveryForm
          ?.get('notificationConfirmMobile')
          .updateValueAndValidity();
      });

    if (this.cloneFlag) {
      this.supportDeliveryForm.get('notificationPreference').disable();
      this.supportDeliveryForm.get('notificationEmail').disable();
      this.supportDeliveryForm.get('notificationMobile').disable();
    }
  }

  ngOnDestroy(): void {
    this.preferenceSubscription?.unsubscribe();
  }

  /**
   * Returns the control of the form
   */
  get supportDeliveryFormControl(): { [key: string]: AbstractControl } {
    return this.supportDeliveryForm?.controls;
  }

  /**
   * Toggles the select field based on event
   *
   * @param $event select change event
   */
  preferenceSelect($event: MatSelectChange) {
    if ($event.value === 'Someone else') {
      this.showTextField = true;
    } else {
      this.showTextField = false;
    }
  }

  showEmail(): boolean {
    const notificationPreference =
      this.supportDeliveryForm?.get('notificationPreference')?.value || '';
    return (
      notificationPreference === 'Email' ||
      notificationPreference === 'Email & Mobile'
    );
  }

  showMobile(): boolean {
    const notificationPreference =
      this.supportDeliveryForm?.get('notificationPreference')?.value || '';
    return (
      notificationPreference === 'Mobile' ||
      notificationPreference === 'Email & Mobile'
    );
  }

  setEmail(event: MatCheckboxChange) {
    const email = this.previousEmail || this.emailOnFile;
    if (event.checked) {
      this.supportDeliveryForm?.get('notificationEmail').patchValue(email);
      this.supportDeliveryForm
        ?.get('notificationConfirmEmail')
        .patchValue(email);
    } else {
      this.supportDeliveryForm?.get('notificationEmail').patchValue('');
      this.supportDeliveryForm?.get('notificationConfirmEmail').patchValue('');
    }
    this.supportDeliveryForm?.get('notificationEmail').updateValueAndValidity();
    this.supportDeliveryForm
      ?.get('notificationConfirmEmail')
      .updateValueAndValidity();
  }

  showConfirmEmail() {
    if (this.cloneFlag) return false;
    if (this.showEmailCheckBox)
      return (
        this.supportDeliveryForm?.get('notificationEmail').value &&
        !this.setEmailCheckbox.checked
      );
    else return this.supportDeliveryForm?.get('notificationEmail').value;
  }

  notificationEmailChange() {
    if (this.showEmailCheckBox && this.setEmailCheckbox.checked) {
      this.setEmailCheckbox.checked = false;
      this.supportDeliveryForm?.get('notificationConfirmEmail').patchValue('');
    }
  }

  setMobile(event: MatCheckboxChange) {
    const mobile = this.previousMobile || this.mobileOnFile;
    if (event.checked) {
      this.supportDeliveryForm?.get('notificationMobile').patchValue(mobile);
      this.supportDeliveryForm
        ?.get('notificationConfirmMobile')
        .patchValue(mobile);
    } else {
      this.supportDeliveryForm?.get('notificationMobile').patchValue('');
      this.supportDeliveryForm?.get('notificationConfirmMobile').patchValue('');
    }
    this.supportDeliveryForm
      ?.get('notificationMobile')
      .updateValueAndValidity();
    this.supportDeliveryForm
      ?.get('notificationConfirmMobile')
      .updateValueAndValidity();
  }

  showConfirmMobile() {
    if (this.cloneFlag) return false;
    if (this.showMobileCheckBox)
      return (
        this.supportDeliveryForm?.get('notificationMobile').value &&
        !this.setMobileCheckbox.checked
      );
    else return this.supportDeliveryForm?.get('notificationMobile').value;
  }

  notificationMobileChange() {
    if (this.showMobileCheckBox && this.setMobileCheckbox.checked) {
      this.setMobileCheckbox.checked = false;
      this.supportDeliveryForm?.get('notificationConfirmMobile').patchValue('');
    }
  }
}
