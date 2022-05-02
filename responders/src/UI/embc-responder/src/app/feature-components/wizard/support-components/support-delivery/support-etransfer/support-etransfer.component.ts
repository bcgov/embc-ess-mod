import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { SupplierListItemModel } from 'src/app/core/models/supplier-list-item.model';
import { StepSupportsService } from '../../../step-supports/step-supports.service';
import { MatSelectChange } from '@angular/material/select';
import {
  CustomErrorMailMatcher,
  CustomErrorMobileMatcher
} from '../../../profile-components/contact/contact.component';

@Component({
  selector: 'app-support-etransfer',
  templateUrl: './support-etransfer.component.html',
  styleUrls: ['./support-etransfer.component.scss']
})
export class SupportEtransferComponent implements OnInit, OnDestroy {
  @Input() supportDeliveryForm: FormGroup;
  @Input() editFlag: boolean;
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

  constructor(public stepSupportsService: StepSupportsService) {}

  ngOnInit(): void {
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
}
