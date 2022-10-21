import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  Validators,
  AbstractControl,
  UntypedFormGroup
} from '@angular/forms';
import { Router } from '@angular/router';
import { SupplierModel } from 'src/app/core/models/supplier.model';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { EditSupplierService } from './edit-supplier.service';
import * as globalConst from '../../../core/services/global-constants';

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.scss']
})
export class EditSupplierComponent implements OnInit {
  editForm: UntypedFormGroup;
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
    private editSupplierService: EditSupplierService
  ) {
    if (this.editSupplierService.editedSupplier === undefined) {
      this.router.navigate([
        '/responder-access/supplier-management/suppliers-list'
      ]);
    }
  }

  ngOnInit(): void {
    this.createEditForm();
  }

  /**
   * Returns edit form control
   */
  get editFormControl(): { [key: string]: AbstractControl } {
    return this.editForm.controls;
  }

  /**
   * Returns the gstNumber form
   */
  get gstNumber(): UntypedFormGroup {
    return this.editForm.get('gstNumber') as UntypedFormGroup;
  }

  /**
   * Returns the control of the address form
   */
  public get addressFormGroup(): UntypedFormGroup {
    return this.editForm.get('address') as UntypedFormGroup;
  }

  /**
   * Returns the control of the address form
   */
  public get supplierContactFormGroup(): UntypedFormGroup {
    return this.editForm.get('contact') as UntypedFormGroup;
  }

  /**
   * Returns the control of the primary contact form
   */
  get contactFormControl(): { [key: string]: AbstractControl } {
    const contactFormGroup = this.editForm.get('contact') as UntypedFormGroup;
    return contactFormGroup.controls;
  }

  /**
   * Goes to the Review page displaying recent changes
   */
  next(): void {
    this.saveDataForm();
    const updatedSupplier: SupplierModel =
      this.editSupplierService.editedSupplier;
    this.router.navigate(
      ['/responder-access/supplier-management/review-supplier'],
      {
        queryParams: { action: 'edit' },
        state: { ...updatedSupplier }
      }
    );
  }

  /**
   * Cancels the action of editing by going back to the Suppliers list page
   */
  cancel(): void {
    this.router.navigate([
      '/responder-access/supplier-management/suppliers-list'
    ]);
  }

  /**
   * Creates a form to handle supplier's data edition
   */
  private createEditForm(): void {
    this.editForm = this.formBuilder.group({
      supplierLegalName: [
        this.editSupplierService.editedSupplier?.legalName ?? '',
        [this.customValidation.whitespaceValidator()]
      ],
      supplierName: [
        this.editSupplierService.editedSupplier?.name ?? '',
        [this.customValidation.whitespaceValidator()]
      ],
      gstNumber: this.formBuilder.group(
        {
          part1: [
            {
              value:
                this.editSupplierService.editedSupplier?.supplierGstNumber
                  ?.part1 ?? '',
              disabled: true
            },
            [Validators.required, Validators.pattern(globalConst.gstFirstField)]
          ],
          part2: [
            {
              value:
                this.editSupplierService.editedSupplier?.supplierGstNumber
                  ?.part2 ?? '',
              disabled: true
            },
            [
              Validators.required,
              Validators.pattern(globalConst.gstSecondField)
            ]
          ]
        },
        {
          validators: [
            this.customValidation.groupRequiredValidator(),
            this.customValidation.groupMinLengthValidator()
          ]
        }
      ),
      address: this.createSupplierAddressEditForm(),
      contact: this.createContactEditForm()
    });
  }

  /**
   * Creates the primary address form
   *
   * @returns form group
   */
  private createSupplierAddressEditForm(): UntypedFormGroup {
    return this.formBuilder.group({
      addressLine1: [
        this.editSupplierService.editedSupplier?.address?.addressLine1 ?? '',
        [this.customValidation.whitespaceValidator()]
      ],
      addressLine2: [
        this.editSupplierService.editedSupplier?.address?.addressLine2 ?? ''
      ],
      community: [
        this.editSupplierService.editedSupplier?.address?.community ?? '',
        [Validators.required]
      ],
      stateProvince: [
        this.editSupplierService.editedSupplier?.address?.stateProvince ??
          globalConst.defaultProvince,
        [Validators.required]
      ],
      country: [
        this.editSupplierService.editedSupplier?.address?.country ??
          globalConst.defaultCountry,
        [Validators.required]
      ],
      postalCode: [
        this.editSupplierService.editedSupplier?.address?.postalCode ?? '',
        [this.customValidation.postalValidation().bind(this.customValidation)]
      ]
    });
  }

  private createContactEditForm(): UntypedFormGroup {
    return this.formBuilder.group({
      lastName: [
        this.editSupplierService.editedSupplier?.contact?.lastName ?? '',
        [this.customValidation.whitespaceValidator()]
      ],
      firstName: [
        this.editSupplierService.editedSupplier?.contact?.firstName ?? '',
        [this.customValidation.whitespaceValidator()]
      ],
      phone: [
        this.editSupplierService.editedSupplier?.contact?.phone ?? '',
        [
          Validators.required,
          this.customValidation
            .maskedNumberLengthValidator()
            .bind(this.customValidation)
        ]
      ],
      email: [
        this.editSupplierService?.editedSupplier?.contact?.email ?? '',
        [Validators.email]
      ]
    });
  }

  private saveDataForm(): void {
    this.editSupplierService.editedSupplier.name =
      this.editForm.get('supplierName').value;
    this.editSupplierService.editedSupplier.legalName =
      this.editForm.get('supplierLegalName').value;
    this.editSupplierService.editedSupplier.supplierGstNumber =
      this.editForm.get('gstNumber').value;
    this.editSupplierService.editedSupplier.address =
      this.editForm.get('address').value;
    this.editSupplierService.editedSupplier.contact =
      this.editForm.get('contact').value;
  }
}
