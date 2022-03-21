import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { EtransferFeaturesService } from '../../../../core/services/helper/etransferfeatures.service';

@Component({
  selector: 'app-support-delivery',
  templateUrl: './support-delivery.component.html',
  styleUrls: ['./support-delivery.component.scss']
})
export class SupportDeliveryComponent implements OnInit, AfterViewChecked {
  supportDeliveryForm: FormGroup;
  etransferDeliveryForm: FormGroup;
  editFlag = false;
  selectedSupportMethod: SupportMethod;
  SupportMethod = SupportMethod;
  ETransferStatus = ETransferStatus;

  constructor(
    public stepSupportsService: StepSupportsService,
    private router: Router,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
    public featureService: EtransferFeaturesService,
    private computeState: ComputeRulesService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state;
        if (state?.action === 'edit') {
          this.editFlag = true;
        }
      }
    }
  }

  ngOnInit(): void {
    this.createSupportDeliveryForm();
    this.createEtransferDeliveryForm();
    this.computeState.triggerEvent();
    console.log(this.featureService);
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

  createEtransferDeliveryForm(): void {
    this.etransferDeliveryForm = this.formBuilder.group({
      recipientFirstName: [this.featureService?.selectedEvacueeInContext?.personalDetails?.firstName  || ''],
      recipientLastName: [this.featureService?.selectedEvacueeInContext?.personalDetails?.lastName?.toUpperCase()  || ''],
      notificationPreference: [
        '',
        [Validators.required]
      ],
      email: [''],
      mobile: [''],
    });
  }

  /**
   * Creates support delivery form
   */
  createSupportDeliveryForm(): void {
    this.supportDeliveryForm = this.formBuilder.group({
      issuedTo: [
        this.stepSupportsService?.supportDelivery?.issuedTo ?? '',
        [Validators.required]
      ],
      name: [
        this.stepSupportsService?.supportDelivery?.name ?? '',
        [
          this.customValidation
            .conditionalValidation(
              () =>
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
      details: this.createSupplierDetailsForm()
    });
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
      console.log(this.stepSupportsService.supportDelivery);
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
    if (!this.supportDeliveryForm.valid) {
      this.supportDeliveryForm.markAllAsTouched();
    } else {
      this.stepSupportsService.supportDelivery =
        this.supportDeliveryForm.getRawValue();
      console.log(this.stepSupportsService.supportDelivery);
      this.stepSupportsService.saveAsDraft();
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
      console.log(this.stepSupportsService.supportDelivery);
      this.stepSupportsService.editDraft();
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

  private billetingSupplierForm(): FormGroup {
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

  private groupLodgingSupplierForm(): FormGroup {
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

  setSupportMethod(method: SupportMethod) {
    this.selectedSupportMethod = method;
  }
}
