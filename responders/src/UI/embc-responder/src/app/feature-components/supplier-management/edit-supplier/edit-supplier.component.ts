import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import {
  SupplierListDataService,
  SupplierTemp
} from '../suppliers-list/supplier-list-data.service';

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.scss']
})
export class EditSupplierComponent implements OnInit {
  editForm: FormGroup;
  selectedSupplier: SupplierTemp;

  constructor(
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
    private router: Router,
    private supplierListDataService: SupplierListDataService
  ) {}

  ngOnInit(): void {
    this.selectedSupplier = this.supplierListDataService.getSelectedSupplier();
    this.createEditForm();
  }

  /**
   * Returns form control
   */
  get editFormControl(): { [key: string]: AbstractControl } {
    return this.editForm.controls;
  }

  /**
   * Returns the control of the address form
   */
  public get addressFormGroup(): FormGroup {
    return this.editForm.get('address') as FormGroup;
  }

  next(): void {
    const updatedSupplier: SupplierTemp = this.editForm.getRawValue();
    this.router.navigate(
      ['/responder-access/supplier-management/review-supplier'],
      {
        queryParams: { action: 'edit' },
        state: { ...this.selectedSupplier, ...updatedSupplier }
      }
    );
  }

  cancel(): void {
    this.router.navigate([
      '/responder-access/supplier-management/suppliers-list'
    ]);
  }

  private createEditForm(): void {
    this.editForm = this.formBuilder.group({
      supplierLegalName: [
        this.selectedSupplier?.legalName ?? '',
        [this.customValidation.whitespaceValidator()]
      ],
      supplierName: [
        this.selectedSupplier?.name ?? '',
        [this.customValidation.whitespaceValidator()]
      ],
      gstNumber: this.formBuilder.group(
        {
          part1: [
            this.selectedSupplier?.gstNumber?.part1 ?? '',
            [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
          ],
          part2: [
            this.selectedSupplier?.gstNumber?.part2 ?? '',
            [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
          ]
        },
        {
          validators: [
            this.customValidation.groupRequiredValidator(),
            this.customValidation.groupMinLengthValidator()
          ]
        }
      ),
      address: this.createSupplierAddressEditForm()
    });
  }

  get gstNumber(): FormGroup {
    return this.editForm.get('gstNumber') as FormGroup;
  }

  /**
   * Creates the primary address form
   *
   * @returns form group
   */
  private createSupplierAddressEditForm(): FormGroup {
    return this.formBuilder.group({
      addressLine1: [
        this.selectedSupplier?.address?.addressLine1 ?? '',
        [this.customValidation.whitespaceValidator()]
      ],
      addressLine2: [this.selectedSupplier?.address?.addressLine2 ?? ''],
      community: [
        this.selectedSupplier?.address?.community ?? '',
        [Validators.required]
      ],
      stateProvince: [
        this.selectedSupplier?.address?.stateProvince ?? '',
        [Validators.required]
      ],
      country: [
        this.selectedSupplier?.address?.country ?? '',
        [Validators.required]
      ],
      postalCode: [
        this.selectedSupplier?.address?.postalCode ?? '',
        [this.customValidation.postalValidation().bind(this.customValidation)]
      ]
    });
  }
}
