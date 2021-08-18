import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { AddSupplierService } from './add-supplier.service';
import * as globalConst from '../../../core/services/global-constants';
import { GstNumberModel } from 'src/app/core/models/gst-number.model';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss']
})
export class AddSupplierComponent implements OnInit {
  addForm: FormGroup;
  showLoader = false;

  constructor(
    private builder: FormBuilder,
    private customValidation: CustomValidationService,
    private router: Router,
    private addSupplierService: AddSupplierService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.constructAddForm();
  }

  /**
   * Returns form control
   */
  get addFormControl(): { [key: string]: AbstractControl } {
    return this.addForm.controls;
  }

  /**
   * Navigates to a new page according to the verification whether the supplier exists or not
   */
  next(): void {
    // this.saveDataForm();
    // this.router.navigate([
    //   '/responder-access/supplier-management/new-supplier'
    // ]);
    const gstNumber: GstNumberModel = {
      part1: this.addForm.get('gstNumber.part1').value,
      part2: this.addForm.get('gstNumber.part2').value
    };
    this.checkSupplierExistance(gstNumber);
  }

  /**
   * Cancel the action of adding a new supplier by going back to the suppliers list page
   */
  cancel(): void {
    this.router.navigate([
      '/responder-access/supplier-management/list-suppliers'
    ]);
  }

  get gstNumber(): FormGroup {
    return this.addForm.get('gstNumber') as FormGroup;
  }

  /**
   * Checks if the supplier exists in the ERA system
   *
   * @param $event username input change event
   */
  private checkSupplierExistance(gstNumber: GstNumberModel): void {
    this.showLoader = !this.showLoader;
    // this.addSupplierService.checkSupplierExists(gstNumber).subscribe(
    //   (value) => {
    //     this.showLoader = !this.showLoader;
    //     console.log(value);
    //   },
    //   (error) => {
    //     console.log(error);
    //     this.showLoader = !this.showLoader;
    //     this.alertService.clearAlert();
    //     this.alertService.setAlert('danger', globalConst.supplierCheckerror);
    //   }
    // );
    if (true) {
      this.router.navigate([
        '/responder-access/supplier-management/supplier-exist'
      ]);
    } else {
      this.saveDataForm();
      this.router.navigate([
        '/responder-access/supplier-management/new-supplier'
      ]);
    }
  }

  /**
   * Creates a new form to handle the addition of new supplier to the system
   */
  private constructAddForm(): void {
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
   * Saves the data from the form and save it into the addSUpplier service
   */
  private saveDataForm() {
    this.addSupplierService.supplierLegalName = this.addForm.get(
      'supplierLegalName'
    ).value;
    this.addSupplierService.supplierName = this.addForm.get(
      'supplierName'
    ).value;

    const gstNumber: GstNumberModel = {
      part1: this.addForm.get('gstNumber.part1').value,
      part2: this.addForm.get('gstNumber.part2').value
    };
    this.addSupplierService.supplierGstNumber = gstNumber;
  }
}
