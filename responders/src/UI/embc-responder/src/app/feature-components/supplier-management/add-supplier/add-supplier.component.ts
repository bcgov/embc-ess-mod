import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss']
})
export class AddSupplierComponent implements OnInit {
  addForm: FormGroup;

  constructor(
    private builder: FormBuilder,
    private customValidation: CustomValidationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.constructAddForm();
  }

  constructAddForm(): void {
    this.addForm = this.builder.group({
      supplierLegalName: ['', [this.customValidation.whitespaceValidator()]],
      supplierName: [''],
      gstNumber: this.builder.group(
        {
          part1: [
            '',
            [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
          ],
          part2: [
            '',
            [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
          ]
        },
        {
          validators: [
            this.customValidation.groupRequiredValidator(),
            this.customValidation.groupMinLengthValidator()
          ]
        }
      )
    });
  }

  /**
   * Returns form control
   */
  get addFormControl(): { [key: string]: AbstractControl } {
    return this.addForm.controls;
  }

  next(): void {
    this.router.navigate([
      '/responder-access/supplier-management/new-supplier'
    ]);
  }

  cancel(): void {
    this.router.navigate([
      '/responder-access/supplier-management/list-suppliers'
    ]);
  }

  get gstNumber(): FormGroup {
    return this.addForm.get('gstNumber') as FormGroup;
  }
}
