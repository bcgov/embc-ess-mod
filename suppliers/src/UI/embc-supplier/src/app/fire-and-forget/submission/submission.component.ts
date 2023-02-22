import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  UntypedFormArray,
  Validators
} from '@angular/forms';
import { SupplierService } from '../../core/services/supplier.service';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap
} from 'rxjs/operators';
import { NgbModal, NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { Country } from '../../core/model/country';
import { CustomValidationService } from '../../core/services/customValidation.service';
import * as globalConst from 'src/app/core/services/globalConstants';

@Component({
  selector: 'app-supplier-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss'],
  providers: [CustomValidationService, NgbTypeaheadConfig]
})
export class SubmissionComponent implements OnInit {
  supplierForm: UntypedFormGroup;
  remitDiv = false;
  addressDiv = false;
  countryList: Observable<Country[]>;
  selectedRemitCountry: string;
  locatedInBC: string;

  refArray: any = [];
  constructor(
    private router: Router,
    private builder: UntypedFormBuilder,
    private supplierService: SupplierService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private customValidator: CustomValidationService,
    private config: NgbTypeaheadConfig
  ) {
    config.showHint = true;
  }

  get control() {
    return this.supplierForm.controls;
  }

  get invoices() {
    return this.supplierForm.get('invoices') as UntypedFormArray;
  }

  get receipts() {
    return this.supplierForm.get('receipts') as UntypedFormArray;
  }

  ngOnInit() {
    this.initializeForm();
    this.supplierForm
      .get('remitToOtherBusiness')
      .valueChanges.subscribe((value) => {
        this.updateOnVisibility();
      });
    this.supplierForm.get('supplierBC').valueChanges.subscribe((value) => {
      this.updateRadioVisibility();
    });
    this.repopulateFormData();
    this.supplierService.isReload = false;
  }

  searchCity = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((term) =>
        this.supplierService
          .getCityList()
          .pipe(
            map((resp) =>
              resp
                .filter((v) =>
                  v.name.toLowerCase().startsWith(term.toLowerCase())
                )
                .splice(0, 10)
            )
          )
      )
    );

  cityFormatter = (x: { name: string }) => x.name;

  searchState = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((term) =>
        this.supplierService
          .getStateList()
          .pipe(
            map((resp) =>
              resp
                .filter((v) =>
                  v.name.toLowerCase().startsWith(term.toLowerCase())
                )
                .splice(0, 10)
            )
          )
      )
    );

  stateFormatter = (x: { name: string }) => x.name;

  searchProvince = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((term) =>
        this.supplierService
          .getProvinceList()
          .pipe(
            map((resp) =>
              resp
                .filter((v) =>
                  v.name.toLowerCase().startsWith(term.toLowerCase())
                )
                .splice(0, 10)
            )
          )
      )
    );

  provinceFormatter = (x: { name: string }) => x.name;

  searchCountry = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((term) =>
        this.supplierService
          .getCountryListt()
          .pipe(
            map((resp) =>
              resp
                .filter((v) =>
                  v.name.toLowerCase().startsWith(term.toLowerCase())
                )
                .splice(0, 10)
            )
          )
      )
    );

  countryFormatter = (x: { name: string }) => x.name;

  repopulateFormData() {
    const storedSupplierDetails = this.supplierService.getSupplierDetails();
    if (storedSupplierDetails) {
      this.supplierService.clearPayload();
      this.initializeForm();
      this.mapFormValues(storedSupplierDetails);
    }
  }

  initializeForm() {
    this.supplierForm = this.builder.group({
      supplierLegalName: ['', this.customValidator.whitespaceValidator()],
      supplierName: ['', this.customValidator.whitespaceValidator()],
      location: [''],
      gstNumber: ['', [Validators.required, Validators.minLength(17)]],
      remitToOtherBusiness: [''],
      businessName: [
        '',
        [
          this.customValidator
            .conditionalValidation(
              () => this.supplierForm.get('remitToOtherBusiness').value,
              this.customValidator.whitespaceValidator()
            )
            .bind(this.customValidator)
        ]
      ],
      businessCountry: [
        '',
        [
          this.customValidator
            .conditionalValidation(
              () => this.supplierForm.get('remitToOtherBusiness').value,
              Validators.required
            )
            .bind(this.customValidator)
        ]
      ],
      supplierBC: [''],

      address: this.builder.group({
        address1: ['', this.customValidator.whitespaceValidator()],
        address2: [''],
        city: ['', Validators.required],
        province: [globalConst.defaultProvince.name],
        postalCode: [
          '',
          [Validators.required, Validators.pattern(globalConst.postalPattern)]
        ],
        country: [globalConst.defaultCountry.name]
      }),

      contactPerson: this.builder.group({
        firstName: ['', this.customValidator.whitespaceValidator()],
        lastName: ['', this.customValidator.whitespaceValidator()],
        email: ['', Validators.email],
        phone: ['', [Validators.required, Validators.minLength(12)]],
        fax: ['', Validators.minLength(12)]
      }),

      remittanceAddress: this.builder.group({
        address1: [
          '',
          [
            this.customValidator
              .conditionalValidation(
                () => this.supplierForm.get('remitToOtherBusiness').value,
                this.customValidator.whitespaceValidator()
              )
              .bind(this.customValidator)
          ]
        ],
        address2: [''],
        city: [
          '',
          [
            this.customValidator
              .conditionalValidation(
                () => this.supplierForm.get('remitToOtherBusiness').value,
                Validators.required
              )
              .bind(this.customValidator)
          ]
        ],
        province: [
          '',
          [
            this.customValidator
              .conditionalValidation(
                () =>
                  this.supplierForm.get('remitToOtherBusiness').value &&
                  this.compareCountry(
                    this.supplierForm.get('businessCountry').value,
                    globalConst.defaultCountry
                  ) &&
                  this.supplierForm.get('supplierBC').value === 'no',
                Validators.required
              )
              .bind(this.customValidator)
          ]
        ],
        state: [
          '',
          [
            this.customValidator
              .conditionalValidation(
                () =>
                  this.supplierForm.get('remitToOtherBusiness').value &&
                  this.compareCountry(
                    this.supplierForm.get('businessCountry').value,
                    globalConst.usDefaultObject
                  ),
                Validators.required
              )
              .bind(this.customValidator)
          ]
        ],
        region: [''],
        postalCode: [
          '',
          [
            Validators.pattern(globalConst.postalPattern),
            this.customValidator
              .conditionalValidation(
                () =>
                  this.supplierForm.get('remitToOtherBusiness').value &&
                  this.compareCountry(
                    this.supplierForm.get('businessCountry').value,
                    globalConst.defaultCountry
                  ),
                this.customValidator.whitespaceValidator()
              )
              .bind(this.customValidator)
          ]
        ],
        zipCode: [
          '',
          [
            Validators.pattern(globalConst.zipCodePattern),
            this.customValidator
              .conditionalValidation(
                () =>
                  this.supplierForm.get('remitToOtherBusiness').value &&
                  this.compareCountry(
                    this.supplierForm.get('businessCountry').value,
                    globalConst.usDefaultObject
                  ),
                Validators.required
              )
              .bind(this.customValidator)
          ]
        ],
        otherCode: ['']
      }),

      supplierSubmissionType: [''],
      invoices: this.builder.array([]),
      receipts: this.builder.array([])
    });
  }

  toggleVisibility(event: any) {
    this.remitDiv = event.target.checked;
    if (!event.target.checked) {
      this.supplierForm.get('businessName').reset();
      this.supplierForm.get('remittanceAddress').reset();
      this.supplierForm.get('businessCountry').reset();
      this.supplierForm.get('supplierBC').reset();
    }
  }

  remitVisibility(selectedValue: any) {
    this.selectedRemitCountry = selectedValue;
    if (selectedValue === 'Canada') {
      this.addressDiv = false;
    } else {
      this.addressDiv = true;
    }
    this.resetRemittanceFields();
  }

  resetRemittanceFields() {
    this.supplierForm.get('supplierBC').reset();
    this.supplierForm.get('remittanceAddress').reset();
  }

  locatedChange(event: any) {
    this.locatedInBC = event.target.value;
    this.addressDiv = true;
    this.supplierForm.get('remittanceAddress').reset();
  }

  createInvoiceFormArray() {
    return this.builder.group({
      invoiceNumber: [
        '',
        [
          Validators.required,
          this.customValidator
            .invoiceValidator(this.invoices)
            .bind(this.customValidator)
        ]
      ],
      invoiceDate: [
        null,
        [
          Validators.required,
          this.customValidator.futureDateValidator().bind(this.customValidator),
          Validators.pattern(globalConst.datePattern)
        ]
      ],
      invoiceAttachments: this.builder.array([], [Validators.required]),
      referralList: ['', Validators.required],
      referrals: this.builder.array([], Validators.required),
      invoiceTotalAmount: ['']
    });
  }

  createReceiptFormArray() {
    return this.builder.group({
      referralNumber: [
        '',
        [
          Validators.required,
          this.customValidator
            .referralNumberValidator(this.receipts)
            .bind(this.customValidator)
        ]
      ],
      referrals: this.builder.array([]),
      receiptTotalAmount: [''],
      referralAttachments: this.builder.array([], [Validators.required]),
      receiptAttachments: this.builder.array([], [Validators.required])
    });
  }

  onSubmit() {
    this.supplierForm
      .get('address.province')
      .setValue(globalConst.defaultProvince);
    this.supplierForm
      .get('address.country')
      .setValue(globalConst.defaultCountry);
    const supplierDetails = this.supplierForm.value;
    this.supplierService.setSupplierDetails(supplierDetails);
    this.supplierService.createPayload(supplierDetails);
    this.router.navigate(['/review']);
  }

  onValueChange(event: any) {
    if (event.target.value === 'invoice') {
      if (this.receipts.length > 0) {
        const modalRef = this.modalService.open(ModalComponent);
        modalRef.componentInstance.messageBody = globalConst.showInvoiceMsg;
        modalRef.componentInstance.buttonText = globalConst.showInvoiceButton;
        modalRef.componentInstance.clearIndicator.subscribe((e) => {
          if (e) {
            this.cleanReceiptTemplate();
            this.injectInvoiceTemplate();
          } else {
            this.supplierForm.get('supplierSubmissionType').setValue('receipt');
          }
        });

        modalRef.result.then(
          (res) => {
            //When user closes modal
            if (res !== 'action') {
              this.supplierForm
                .get('supplierSubmissionType')
                .setValue('receipt');
            }
          },
          (res) => {
            //On backdrop click
            if (res !== 'action') {
              this.supplierForm
                .get('supplierSubmissionType')
                .setValue('receipt');
            }
          }
        );
      } else {
        this.injectInvoiceTemplate();
      }
    } else if (event.target.value === 'receipt') {
      if (this.invoices.length > 0) {
        const modalRef = this.modalService.open(ModalComponent);
        modalRef.componentInstance.messageBody = globalConst.showRefferalMsg;
        modalRef.componentInstance.buttonText = globalConst.showReferalButton;
        modalRef.componentInstance.clearIndicator.subscribe((e) => {
          if (e) {
            this.cleanInvoiceTemplate();
            this.injectReceiptTemplate();
          } else {
            this.supplierForm.get('supplierSubmissionType').setValue('invoice');
          }
        });

        modalRef.result.then(
          (res) => {
            //When user closes modal
            if (res !== 'action')
              this.supplierForm
                .get('supplierSubmissionType')
                .setValue('invoice');
          },
          (res) => {
            //On backdrop click
            if (res !== 'action')
              this.supplierForm
                .get('supplierSubmissionType')
                .setValue('invoice');
          }
        );
      } else {
        this.injectReceiptTemplate();
      }
    }
  }

  injectInvoiceTemplate() {
    this.invoices.push(this.createInvoiceFormArray());
    this.cd.detectChanges();
  }

  injectReceiptTemplate() {
    this.receipts.push(this.createReceiptFormArray());
    this.cd.detectChanges();
  }

  addInvoiceTemplate() {
    this.injectInvoiceTemplate();
  }

  addReceiptTemplate() {
    this.injectReceiptTemplate();
  }

  cleanInvoiceTemplate() {
    this.receipts.setValidators(null);
    this.invoices.clear();
  }

  cleanReceiptTemplate() {
    this.receipts.setValidators(null);
    this.receipts.clear();
  }

  deleteInvoice(event: any) {
    this.supplierService
      .confirmModal(
        globalConst.deleteInvoiceMsg,
        globalConst.deleteInvoiceButton
      )
      .subscribe((e) => {
        if (e) {
          this.invoices.removeAt(event);
        }
      });
  }

  deleteReceipt(event: any) {
    this.supplierService
      .confirmModal(
        globalConst.deleteRefferalMsg,
        globalConst.deleteReferalButton
      )
      .subscribe((e) => {
        if (e) {
          this.receipts.removeAt(event);
        }
      });
  }

  mapFormValues(storedSupplierDetails: any) {
    this.supplierService.isReload = true;
    this.supplierForm
      .get('address.address1')
      .setValue(storedSupplierDetails.address.address1);
    this.supplierForm
      .get('address.address2')
      .setValue(storedSupplierDetails.address.address2);
    this.supplierForm
      .get('address.city')
      .setValue(storedSupplierDetails.address.city);
    this.supplierForm
      .get('address.postalCode')
      .setValue(storedSupplierDetails.address.postalCode);
    this.supplierForm
      .get('contactPerson')
      .setValue(storedSupplierDetails.contactPerson);
    this.supplierForm
      .get('supplierBC')
      .setValue(storedSupplierDetails.supplierBC);
    this.supplierForm
      .get('supplierLegalName')
      .setValue(storedSupplierDetails.supplierLegalName);
    this.supplierForm
      .get('supplierName')
      .setValue(storedSupplierDetails.supplierName);
    this.supplierForm
      .get('supplierSubmissionType')
      .setValue(storedSupplierDetails.supplierSubmissionType);
    this.supplierForm
      .get('businessCountry')
      .setValue(storedSupplierDetails.businessCountry);
    this.supplierForm
      .get('businessName')
      .setValue(storedSupplierDetails.businessName);
    this.supplierForm
      .get('gstNumber')
      .setValue(storedSupplierDetails.gstNumber);
    this.supplierForm.get('location').setValue(storedSupplierDetails.location);
    this.supplierForm
      .get('remitToOtherBusiness')
      .setValue(storedSupplierDetails.remitToOtherBusiness);
    this.supplierForm
      .get('remittanceAddress')
      .setValue(storedSupplierDetails.remittanceAddress);
    this.loadExistingRemittanceValues(storedSupplierDetails);
    const submissionType = this.supplierForm.get('supplierSubmissionType');
    this.loadWithExistingValues(submissionType);
  }

  compareCountry(c1: Country, c2: Country) {
    if (c1 === null || c2 === null || c1 === undefined || c2 === undefined) {
      return null;
    }
    return c1.code === c2.code;
  }

  loadExistingRemittanceValues(storedSupplierDetails: any) {
    this.remitDiv = storedSupplierDetails.remitToOtherBusiness;
    if (
      storedSupplierDetails.businessCountry !== null &&
      storedSupplierDetails.businessCountry !== undefined
    ) {
      this.selectedRemitCountry = storedSupplierDetails.businessCountry.name;
      if (this.selectedRemitCountry === 'Canada') {
        this.addressDiv = false;
      } else {
        this.addressDiv = true;
      }
      this.locatedInBC = this.supplierForm.get('supplierBC').value;
      if (this.locatedInBC !== '' || this.locatedInBC !== null) {
        this.addressDiv = true;
      }
    }
  }

  loadWithExistingValues(event: any) {
    const storedSupplierDetails = this.supplierService.getSupplierDetails();
    if (event.value === 'invoice') {
      storedSupplierDetails.invoices.forEach((invoice) => {
        this.invoices.push(this.createInvoiceFormArrayWithValues(invoice));
      });
    } else if (event.value === 'receipt') {
      storedSupplierDetails.receipts.forEach((rec) => {
        this.receipts.push(this.createReceiptFormArrayWithValues(rec));
      });
    }
    this.cd.detectChanges();
  }

  createInvoiceFormArrayWithValues(invoice: any) {
    return this.builder.group({
      invoiceNumber: [invoice.invoiceNumber, Validators.required],
      invoiceDate: [
        invoice.invoiceDate,
        [
          Validators.required,
          this.customValidator.futureDateValidator().bind(this.customValidator),
          Validators.pattern(globalConst.datePattern)
        ]
      ],
      invoiceAttachments: this.builder.array([], [Validators.required]),
      referralList: [invoice.referralList, Validators.required],
      referrals: this.builder.array([], Validators.required),
      invoiceTotalAmount: [invoice.invoiceTotalAmount]
    });
  }

  createReceiptFormArrayWithValues(receipt: any) {
    return this.builder.group({
      referralNumber: [receipt.referralNumber, Validators.required],
      referrals: this.builder.array([]),
      receiptTotalAmount: [receipt.receiptTotalAmount],
      referralAttachments: this.builder.array([], [Validators.required]),
      receiptAttachments: this.builder.array([], [Validators.required])
    });
  }

  updateOnVisibility() {
    this.supplierForm
      .get('remittanceAddress.postalCode')
      .updateValueAndValidity();
    this.supplierForm.get('remittanceAddress.zipCode').updateValueAndValidity();
    this.supplierForm.get('businessCountry').updateValueAndValidity();
    this.supplierForm.get('businessName').updateValueAndValidity();
    this.supplierForm
      .get('remittanceAddress.address1')
      .updateValueAndValidity();
    this.supplierForm.get('remittanceAddress.city').updateValueAndValidity();
    this.supplierForm
      .get('remittanceAddress.province')
      .updateValueAndValidity();
    this.supplierForm.get('remittanceAddress.state').updateValueAndValidity();
  }

  updateRadioVisibility() {
    this.supplierForm
      .get('remittanceAddress.province')
      .updateValueAndValidity();
  }
}
