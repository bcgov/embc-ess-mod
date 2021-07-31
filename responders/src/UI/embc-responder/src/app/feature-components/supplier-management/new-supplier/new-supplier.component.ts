import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';

@Component({
  selector: 'app-new-supplier',
  templateUrl: './new-supplier.component.html',
  styleUrls: ['./new-supplier.component.scss']
})
export class NewSupplierComponent implements OnInit {
  newForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService
  ) {}

  ngOnInit(): void {
    this.createNewSupplierForm();
  }

  /**
   * Returns the control of the primary address form
   */
  public get supplierAddressFormGroup(): FormGroup {
    return this.newForm.get('address') as FormGroup;
  }

  next(): void {}

  cancel(): void {}

  private createNewSupplierForm(): void {
    this.newForm = this.formBuilder.group({
      address: this.formBuilder.group({
        addressLine1: ['', [this.customValidation.whitespaceValidator()]],
        addressLine2: [''],
        community: ['', [Validators.required]],
        stateProvince: [''],
        country: ['', [Validators.required]],
        postalCode: [
          '',
          [
            this.customValidation.whitespaceValidator(),
            this.customValidation.postalValidation().bind(this.customValidation)
          ]
        ]
      })
    });
  }
}
