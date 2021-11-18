import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SupplierListItemModel } from 'src/app/core/models/supplier-list-item.model';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { StepSupportsService } from '../../step-supports/step-supports.service';
import * as globalConst from '../../../../core/services/global-constants';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { EvacuationFileHouseholdMember } from 'src/app/core/api/models';

@Component({
  selector: 'app-support-delivery',
  templateUrl: './support-delivery.component.html',
  styleUrls: ['./support-delivery.component.scss']
})
export class SupportDeliveryComponent implements OnInit, AfterViewChecked {
  supportDeliveryForm: FormGroup;
  showTextField = false;
  filteredOptions: Observable<SupplierListItemModel[]>;
  supplierList: SupplierListItemModel[];
  selectedSupplierItem: SupplierListItemModel;
  showSupplierFlag = false;
  showLoader = false;
  color = '#169BD5';
  editFlag = false;

  constructor(
    public stepSupportsService: StepSupportsService,
    private router: Router,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
    private alertService: AlertService,
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
    this.supplierList = this.stepSupportsService.supplierList;
    this.supportDeliveryForm.get('issuedTo').valueChanges.subscribe((value) => {
      this.supportDeliveryForm.get('name').updateValueAndValidity();
    });

    this.filteredOptions = this.supportDeliveryForm
      .get('supplier')
      .valueChanges.pipe(
        startWith(''),
        map((value) =>
          value
            ? this.filter(value)
            : this.supplierList !== undefined
            ? this.supplierList.slice()
            : null
        )
      );

    this.populateExistingIssuedTo();
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  displaySupplier(item: SupplierListItemModel) {
    if (item) {
      return item.name;
    }
  }

  /**
   * Checks if the city value exists in the list
   */
  validateSupplier(): boolean {
    const currentSupplier = this.supportDeliveryForm.get('supplier').value;
    let invalidSupplier = false;
    if (currentSupplier !== null && currentSupplier.name === undefined) {
      invalidSupplier = !invalidSupplier;
      this.supportDeliveryForm
        .get('supplier')
        .setErrors({ invalidSupplier: true });
    }
    return invalidSupplier;
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

  populateExistingIssuedTo() {
    const allMembers: EvacuationFileHouseholdMember[] = this.stepSupportsService
      ?.evacFile?.needsAssessment?.householdMembers;

    if (this.editFlag) {
      if (this.stepSupportsService?.supportDelivery?.issuedTo !== undefined) {
        const valueToSet = allMembers.find(
          (mem) =>
            mem.id === this.stepSupportsService?.supportDelivery?.issuedTo.id
        );
        this.supportDeliveryForm.get('issuedTo').setValue(valueToSet);
      } else {
        this.supportDeliveryForm.get('issuedTo').setValue('Someone else');
        this.showTextField = true;
      }
    } else {
      if (this.stepSupportsService?.supportDelivery?.issuedTo !== undefined) {
        const valueToSet = allMembers.find(
          (mem) =>
            mem.id === this.stepSupportsService?.supportDelivery?.issuedTo.id
        );
        if (valueToSet !== undefined) {
          this.supportDeliveryForm.get('issuedTo').setValue(valueToSet);
        } else {
          this.supportDeliveryForm.get('issuedTo').setValue('Someone else');
          this.showTextField = true;
        }
      }
    }
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
   * Returns the control of the form
   */
  get supportDeliveryFormControl(): { [key: string]: AbstractControl } {
    return this.supportDeliveryForm.controls;
  }

  /**
   * Navigates to details page
   */
  backToDetails() {
    if (!this.editFlag) {
      this.stepSupportsService.supportDelivery = this.supportDeliveryForm.getRawValue();
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
      this.stepSupportsService.supportDelivery = this.supportDeliveryForm.getRawValue();
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
      this.stepSupportsService.supportDelivery = this.supportDeliveryForm.getRawValue();
      console.log(this.stepSupportsService.supportDelivery);
      this.stepSupportsService.editDraft();
      const stateIndicator = { action: 'edit' };
      this.router.navigate(['/ess-wizard/add-supports/view'], {
        state: stateIndicator
      });
    }
  }

  /**
   * Toggles the select field based on event
   *
   * @param $event select change event
   */
  memberSelect($event: MatSelectChange) {
    if ($event.value === 'Someone else') {
      this.showTextField = true;
    } else {
      this.showTextField = false;
    }
  }

  /**
   * Shows the supplier details box
   *
   * @param $event auto complete event
   */
  showDetails($event: MatAutocompleteSelectedEvent) {
    this.selectedSupplierItem = $event.option.value;
    this.showSupplierFlag = true;
  }

  /**
   * Refreshes the supplier list
   */
  refreshList() {
    this.showLoader = !this.showLoader;
    this.stepSupportsService.getSupplierList().subscribe(
      (value) => {
        this.showLoader = !this.showLoader;
        this.stepSupportsService.supplierList = value;
        this.supplierList = value;
        this.filteredOptions = this.supportDeliveryForm
          .get('supplier')
          .valueChanges.pipe(
            startWith(''),
            map((input) => this.filter(input))
          );
      },
      (error) => {
        this.showLoader = !this.showLoader;
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.supplierRefresherror);
      }
    );
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

  private filter(value?: string): SupplierListItemModel[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.supplierList.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
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
}
