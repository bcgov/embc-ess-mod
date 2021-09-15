import { Component, OnInit } from '@angular/core';
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
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { SupplierListItemModel } from 'src/app/core/models/supplier-list-item.model';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { StepSupportsService } from '../../step-supports/step-supports.service';
import * as globalConst from '../../../../core/services/global-constants';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';

@Component({
  selector: 'app-support-delivery',
  templateUrl: './support-delivery.component.html',
  styleUrls: ['./support-delivery.component.scss']
})
export class SupportDeliveryComponent implements OnInit {
  supportDeliveryForm: FormGroup;
  showTextField = false;
  filteredOptions: Observable<SupplierListItemModel[]>;
  supplierList: SupplierListItemModel[];
  selectedSupplierItem: SupplierListItemModel;
  showSupplierFlag = false;
  showLoader = false;
  color = '#169BD5';

  constructor(
    public stepSupportsService: StepSupportsService,
    private router: Router,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {}

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
  }

  displaySupplier(item: SupplierListItemModel) {
    if (item) {
      return item.name;
    }
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
    this.supportDeliveryForm = this.formBuilder.group({
      issuedTo: ['', [Validators.required]],
      name: [
        '',
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
        '',
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
      supplierNote: ['', [this.customValidation.whitespaceValidator()]],
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
    this.router.navigate(['/ess-wizard/add-supports/details']);
  }

  /**
   * Navigates to view support page and saves the new support as drafts
   */
  next() {
    if (!this.supportDeliveryForm.valid) {
      this.supportDeliveryForm.markAllAsTouched();
    } else {
      this.stepSupportsService.supportDelivery = this.supportDeliveryForm.getRawValue();
      this.stepSupportsService.saveAsDraft();
      this.router.navigate(['/ess-wizard/add-supports/view']);
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
      hostName: ['', [this.customValidation.whitespaceValidator()]],
      hostAddress: [''],
      hostCity: ['', [this.customValidation.whitespaceValidator()]],
      hostPhone: [
        '',
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
        '',
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
      hostName: ['', [this.customValidation.whitespaceValidator()]],
      hostAddress: [''],
      hostCity: ['', [this.customValidation.whitespaceValidator()]],
      hostPhone: [
        '',
        [
          this.customValidation
            .maskedNumberLengthValidator()
            .bind(this.customValidation),

          this.customValidation.whitespaceValidator()
        ]
      ]
    });
  }
}
