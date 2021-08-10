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
import * as globalConst from '../../../core/services/global-constants';

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
    this.selectedSupplier = this.supplierListDataService.selectedSupplier;
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
    this.saveFormData();
    this.router.navigate(
      ['/responder-access/supplier-management/review-supplier'],
      {
        queryParams: { action: 'edit' }
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
      gstNumber: this.formBuilder.group({
        part1: ['', [Validators.maxLength(9)]],
        part2: ['', [Validators.maxLength(4)]]
      }),
      address: this.createSupplierAddressEditForm()
    });
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

  private saveFormData(): void {
    this.supplierListDataService.selectedSupplier.legalName = this.editForm.get(
      'supplierLegalName'
    ).value;
    this.supplierListDataService.selectedSupplier.name = this.editForm.get(
      'supplierName'
    ).value;
    this.supplierListDataService.selectedSupplier.gstNumber = this.editForm.get(
      'gstNumber'
    ).value;
    this.supplierListDataService.selectedSupplier.address = this.editForm.get(
      'address'
    ).value;
  }
}
