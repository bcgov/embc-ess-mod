import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { AddSupplierService } from '../add-supplier/add-supplier.service';
import * as globalConst from '../../../core/services/global-constants';
import { SupplierStatus } from 'src/app/core/api/models';

@Component({
  selector: 'app-new-supplier',
  templateUrl: './new-supplier.component.html',
  styleUrls: ['./new-supplier.component.scss']
})
export class NewSupplierComponent implements OnInit {
  newForm: UntypedFormGroup;
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

  constructor(
    private formBuilder: UntypedFormBuilder,
    private customValidation: CustomValidationService,
    private router: Router,
    private addSupplierService: AddSupplierService
  ) {}

  ngOnInit(): void {
    this.createNewSupplierForm();
  }

  /**
   * Returns the form group of the address form
   */
  public get supplierAddressFormGroup(): UntypedFormGroup {
    return this.newForm.get('address') as UntypedFormGroup;
  }

  /**
   * Returns the form group of the primary contact form
   */
  public get supplierContactFormGroup(): UntypedFormGroup {
    return this.newForm.get('primaryContact') as UntypedFormGroup;
  }

  /**
   * Returns the control of the primary contact form
   */
  get contactFormControl(): { [key: string]: AbstractControl } {
    const contactFormGroup = this.newForm.get(
      'primaryContact'
    ) as UntypedFormGroup;
    return contactFormGroup.controls;
  }

  /**
   * Navigates to step 3 of the creation of a new supplier process
   */
  next(): void {
    this.saveDataForm();
    const supplier = this.addSupplierService.getAddedSupplier();
    this.router.navigate(
      ['/responder-access/supplier-management/review-supplier'],
      { state: { ...supplier }, queryParams: { action: 'add' } }
    );
  }

  /**
   * Cancels the action to create a new supplier and goes back to the suppliers' list
   */
  cancel(): void {
    this.router.navigate([
      '/responder-access/supplier-management/suppliers-list'
    ]);
  }

  /**
   * Creates a new supplier form
   */
  private createNewSupplierForm(): void {
    this.newForm = this.formBuilder.group({
      address: this.formBuilder.group({
        addressLine1: [
          this.addSupplierService.supplierAddress?.addressLine1 ?? '',
          [this.customValidation.whitespaceValidator()]
        ],
        addressLine2: [
          this.addSupplierService.supplierAddress?.addressLine2 ?? ''
        ],
        community: [
          this.addSupplierService.supplierAddress?.community ?? '',
          [Validators.required]
        ],
        stateProvince: [
          this.addSupplierService.supplierAddress?.stateProvince ??
            globalConst.defaultProvince,
          [Validators.required]
        ],
        country: [
          this.addSupplierService.supplierAddress?.country ??
            globalConst.defaultCountry,
          [Validators.required]
        ],
        postalCode: [
          this.addSupplierService.supplierAddress?.postalCode ?? '',
          [this.customValidation.postalValidation().bind(this.customValidation)]
        ]
      }),
      primaryContact: this.formBuilder.group({
        lastName: [
          this.addSupplierService.contact?.lastName ?? '',
          [this.customValidation.whitespaceValidator()]
        ],
        firstName: [
          this.addSupplierService.contact?.firstName ?? '',
          [this.customValidation.whitespaceValidator()]
        ],
        phone: [
          this.addSupplierService.contact?.phone ?? '',
          [
            Validators.required,
            this.customValidation
              .maskedNumberLengthValidator()
              .bind(this.customValidation)
          ]
        ],
        email: [
          this.addSupplierService.contact?.email ?? '',
          [Validators.email]
        ]
      })
    });
  }

  /**
   * Saves partial data of the new supplier
   */
  private saveDataForm() {
    this.addSupplierService.supplierAddress = this.newForm.get('address').value;
    this.addSupplierService.contact = this.newForm.get('primaryContact').value;
    this.addSupplierService.status = SupplierStatus.Active;
    this.addSupplierService.mutualAids = [];
  }
}
