import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { StepSupportsService } from '../../step-supports/step-supports.service';
import * as globalConst from '../../../../core/services/global-constants';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { ComputeRulesService } from '../../../../core/services/computeRules.service';
import { ETransferStatus } from '../../../../core/models/appBase.model';
import { SupportMethod } from '../../../../core/api/models/support-method';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { SupportSubCategory } from '../../../../core/api/models';
import { CacheService } from '../../../../core/services/cache.service';
import { CloneSupportDetailsService } from '../existing-support-details/clone-support-details.service';
import { WizardType } from '../../../../core/models/wizard-type.model';

@Component({
  selector: 'app-support-delivery',
  templateUrl: './support-delivery.component.html',
  styleUrls: ['./support-delivery.component.scss']
})
export class SupportDeliveryComponent implements OnInit, AfterViewChecked {
  supportDeliveryForm: UntypedFormGroup;
  editFlag = false;
  cloneFlag = false;
  selectedSupportMethod: SupportMethod;
  supportMethod = SupportMethod;
  eTransferStatus = ETransferStatus;

  constructor(
    public stepSupportsService: StepSupportsService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private customValidation: CustomValidationService,
    public appBaseService: AppBaseService,
    private computeState: ComputeRulesService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private cacheService: CacheService,
    private cloneSupportDetailsService: CloneSupportDetailsService
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state;
        if (state?.action === 'edit') {
          this.editFlag = true;
        }
        if (
          state?.action === 'clone' ||
          this.appBaseService.wizardProperties.wizardType ===
            WizardType.ExtendSupports
        ) {
          this.cloneFlag = true;
        }
      }
    }
  }

  ngOnInit(): void {
    this.selectedSupportMethod =
      this.stepSupportsService?.supportDelivery?.method || null;
    this.createSupportDeliveryForm();
    this.computeState.triggerEvent();
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  /**
   * Navigates to select-support page
   */
  back() {
    this.stepSupportsService
      .openDataLossPopup(globalConst.supportDataLossDialog)
      .afterClosed()
      .subscribe((event) => {
        if (event === 'confirm') {
          this.router.navigate(['/ess-wizard/add-supports/view']);
        }
      });
  }

  /**
   * Creates support delivery form
   */
  createSupportDeliveryForm(): void {
    this.supportDeliveryForm = this.formBuilder.group(
      {
        issuedTo: [
          this.stepSupportsService?.supportDelivery?.issuedTo ?? '',
          [
            this.customValidation
              .conditionalValidation(
                () => this.selectedSupportMethod === SupportMethod.Referral,
                Validators.required
              )
              .bind(this.customValidation)
          ]
        ],
        name: [
          this.stepSupportsService?.supportDelivery?.name ?? '',
          [
            this.customValidation
              .conditionalValidation(
                () =>
                  this.selectedSupportMethod === SupportMethod.Referral &&
                  this.supportDeliveryForm.get('issuedTo').value ===
                    'Someone else',
                this.customValidation.whitespaceValidator()
              )
              .bind(this.customValidation)
          ]
        ],
        supplier: [
          this.stepSupportsService?.supportDelivery?.supplier ?? '',
          [
            this.customValidation
              .conditionalValidation(
                () =>
                  this.selectedSupportMethod === SupportMethod.Referral &&
                  this.stepSupportsService.supportTypeToAdd.value !==
                    'Lodging_Billeting' &&
                  this.stepSupportsService.supportTypeToAdd.value !==
                    'Lodging_Group',
                Validators.required
              )
              .bind(this.customValidation)
          ]
        ],
        supplierNote: [
          this.stepSupportsService?.supportDelivery?.supplierNote ?? ''
        ],
        details: this.createSupplierDetailsForm(),
        recipientFirstName: [
          this.cloneFlag
            ? this.cloneSupportDetailsService.recipientFirstName
            : this.appBaseService?.appModel?.selectedProfile
                ?.selectedEvacueeInContext?.personalDetails?.firstName || ''
        ],
        recipientLastName: [
          this.cloneFlag
            ? this.cloneSupportDetailsService.recipientLastName
            : this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext?.personalDetails?.lastName?.toUpperCase() ||
              ''
        ],
        receivingRegistrantId: [
          this.cloneFlag
            ? this.cloneSupportDetailsService.receivingRegistrantId
            : this.appBaseService?.appModel?.selectedProfile
                ?.selectedEvacueeInContext?.id || ''
        ],
        notificationPreference: [
          this.getExistingPreference(),
          this.customValidation
            .conditionalValidation(
              () => this.selectedSupportMethod === SupportMethod.ETransfer,
              Validators.required
            )
            .bind(this.customValidation)
        ],
        notificationEmail: [
          this.stepSupportsService?.supportDelivery?.notificationEmail ?? '',
          [
            Validators.email,
            this.customValidation.conditionalValidation(
              () =>
                this.selectedSupportMethod === SupportMethod.ETransfer &&
                (this.supportDeliveryForm.get('notificationPreference')
                  .value === 'Email' ||
                  this.supportDeliveryForm.get('notificationPreference')
                    .value === 'Email & Mobile'),
              this.customValidation.whitespaceValidator()
            )
          ]
        ],
        notificationConfirmEmail: [
          '',
          [
            Validators.email,
            this.customValidation.conditionalValidation(
              () =>
                !this.cloneFlag &&
                this.selectedSupportMethod === SupportMethod.ETransfer &&
                (this.supportDeliveryForm.get('notificationPreference')
                  .value === 'Email' ||
                  this.supportDeliveryForm.get('notificationPreference')
                    .value === 'Email & Mobile'),
              this.customValidation.whitespaceValidator()
            )
          ]
        ],
        notificationMobile: [
          this.stepSupportsService?.supportDelivery?.notificationMobile ?? '',
          [
            this.customValidation
              .maskedNumberLengthValidator()
              .bind(this.customValidation),
            this.customValidation.conditionalValidation(
              () =>
                this.selectedSupportMethod === SupportMethod.ETransfer &&
                (this.supportDeliveryForm.get('notificationPreference')
                  .value === 'Mobile' ||
                  this.supportDeliveryForm.get('notificationPreference')
                    .value === 'Email & Mobile'),
              this.customValidation.whitespaceValidator()
            )
          ]
        ],
        notificationConfirmMobile: [
          '',
          [
            this.customValidation
              .maskedNumberLengthValidator()
              .bind(this.customValidation),
            this.customValidation.conditionalValidation(
              () =>
                !this.cloneFlag &&
                this.selectedSupportMethod === SupportMethod.ETransfer &&
                (this.supportDeliveryForm.get('notificationPreference')
                  .value === 'Mobile' ||
                  this.supportDeliveryForm.get('notificationPreference')
                    .value === 'Email & Mobile'),
              this.customValidation.whitespaceValidator()
            )
          ]
        ]
      },
      {
        validators: [
          this.customValidation.confirmNotificationEmailValidator(),
          this.customValidation.confirmNotificationMobileValidator()
        ]
      }
    );
  }

  getExistingPreference() {
    const pref = [];
    if (this.stepSupportsService?.supportDelivery?.notificationEmail)
      pref.push('Email');
    if (this.stepSupportsService?.supportDelivery?.notificationMobile)
      pref.push('Mobile');
    return pref.join(' & ');
  }

  createSupplierDetailsForm() {
    if (
      this.stepSupportsService?.supportTypeToAdd?.value === 'Lodging_Billeting'
    ) {
      return this.billetingSupplierForm();
    } else if (
      this.stepSupportsService?.supportTypeToAdd?.value === 'Lodging_Group'
    ) {
      return this.groupLodgingSupplierForm();
    }
  }

  /**
   * Navigates to details page
   */
  backToDetails() {
    if (!this.editFlag) {
      this.stepSupportsService.supportDelivery =
        this.supportDeliveryForm.getRawValue();
      this.router.navigate(['/ess-wizard/add-supports/details']);
    } else {
      this.router.navigate(['/ess-wizard/add-supports/details'], {
        state: { action: 'edit' }
      });
    }
  }

  /**
   * Navigates to view support page and saves the new support as drafts
   */
  next() {
    if (!this.supportDeliveryForm.valid || !this.selectedSupportMethod) {
      this.supportDeliveryForm.markAllAsTouched();
    } else {
      if (this.supportDeliveryForm.get('notificationEmail').value) {
        this.cacheService.set(
          'previousEmail',
          this.supportDeliveryForm.get('notificationEmail').value
        );
      }

      if (this.supportDeliveryForm.get('notificationMobile').value) {
        this.cacheService.set(
          'previousMobile',
          this.supportDeliveryForm.get('notificationMobile').value
        );
      }

      this.stepSupportsService.supportDelivery =
        this.supportDeliveryForm.getRawValue();
      this.stepSupportsService.saveAsDraft(this.selectedSupportMethod);
      const stateIndicator = { action: 'save' };
      this.router.navigate(['/ess-wizard/add-supports/view'], {
        state: stateIndicator
      });
    }
  }

  saveEdits() {
    if (!this.supportDeliveryForm.valid) {
      this.supportDeliveryForm.markAllAsTouched();
    } else {
      this.stepSupportsService.supportDelivery =
        this.supportDeliveryForm.getRawValue();
      this.stepSupportsService.editDraft(this.selectedSupportMethod);
      const stateIndicator = { action: 'edit' };
      this.router.navigate(['/ess-wizard/add-supports/view'], {
        state: stateIndicator
      });
    }
  }

  /**
   * Open support rate sheet
   */
  openRateSheet() {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: this.stepSupportsService.getRateSheetContent()
      },
      width: '720px'
    });
  }

  hideRateSheet(): boolean {
    return (
      this.stepSupportsService?.supportTypeToAdd?.value !==
      SupportSubCategory.Lodging_Group
    );
  }

  setSupportMethod(method: SupportMethod) {
    this.selectedSupportMethod = method;

    if (method === SupportMethod.Referral) {
      this.supportDeliveryForm.get('notificationPreference').patchValue('');
      this.supportDeliveryForm.get('notificationEmail').patchValue('');
      this.supportDeliveryForm.get('notificationConfirmEmail').patchValue('');
      this.supportDeliveryForm.get('notificationMobile').patchValue('');
    }
    if (method === SupportMethod.ETransfer) {
      this.supportDeliveryForm.get('issuedTo').patchValue('');
      this.supportDeliveryForm.get('name').patchValue('');
      this.supportDeliveryForm.get('supplier').patchValue('');
      this.supportDeliveryForm.get('supplierNote').patchValue('');
    }
  }

  private billetingSupplierForm(): UntypedFormGroup {
    return this.formBuilder.group({
      hostName: [
        this.stepSupportsService?.supportDelivery?.details?.hostName ?? '',
        [this.customValidation.whitespaceValidator()]
      ],
      hostAddress: [
        this.stepSupportsService?.supportDelivery?.details?.hostAddress ?? ''
      ],
      hostCity: [
        this.stepSupportsService?.supportDelivery?.details?.hostCity ?? '',
        [this.customValidation.whitespaceValidator()]
      ],
      hostPhone: [
        this.stepSupportsService?.supportDelivery?.details?.hostPhone ?? '',
        [
          this.customValidation
            .maskedNumberLengthValidator()
            .bind(this.customValidation),
          this.customValidation
            .conditionalValidation(
              () =>
                this.supportDeliveryForm.get('details.emailAddress') === null ||
                this.supportDeliveryForm.get('details.emailAddress').value ===
                  '' ||
                this.supportDeliveryForm.get('details.emailAddress').value ===
                  undefined,
              this.customValidation.whitespaceValidator()
            )
            .bind(this.customValidation)
        ]
      ],
      emailAddress: [
        this.stepSupportsService?.supportDelivery?.details?.emailAddress ?? '',
        [
          Validators.email,
          this.customValidation
            .conditionalValidation(
              () =>
                this.supportDeliveryForm.get('details.hostPhone') === null ||
                this.supportDeliveryForm.get('details.hostPhone').value ===
                  '' ||
                this.supportDeliveryForm.get('details.hostPhone').value ===
                  undefined,
              this.customValidation.whitespaceValidator()
            )
            .bind(this.customValidation)
        ]
      ]
    });
  }

  private groupLodgingSupplierForm(): UntypedFormGroup {
    return this.formBuilder.group({
      hostName: [
        this.stepSupportsService?.supportDelivery?.details?.hostName ?? '',
        [this.customValidation.whitespaceValidator()]
      ],
      hostAddress: [
        this.stepSupportsService?.supportDelivery?.details?.hostAddress ?? '',
        [this.customValidation.whitespaceValidator()]
      ],
      hostCity: [
        this.stepSupportsService?.supportDelivery?.details?.hostCity ?? '',
        [Validators.required]
      ],
      hostCommunityCode: [
        this.stepSupportsService?.supportDelivery?.details?.hostCity ?? ''
      ],
      hostPhone: [
        this.stepSupportsService?.supportDelivery?.details?.hostPhone ?? '',
        [
          this.customValidation
            .maskedNumberLengthValidator()
            .bind(this.customValidation)
        ]
      ]
    });
  }
}
