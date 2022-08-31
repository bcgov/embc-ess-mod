import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { AddSupplierService } from './add-supplier.service';
import * as globalConst from '../../../core/services/global-constants';
import { GstNumberModel } from 'src/app/core/models/gst-number.model';
import { SupplierService } from 'src/app/core/services/suppliers.service';
import { SupplierManagementService } from '../supplier-management.service';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss']
})
export class AddSupplierComponent implements OnInit {
  addForm: UntypedFormGroup;
  showLoader = false;
  color = '#FFFFFF';

  constructor(
    private builder: UntypedFormBuilder,
    private customValidation: CustomValidationService,
    private router: Router,
    private addSupplierService: AddSupplierService,
    private alertService: AlertService,
    private supplierService: SupplierService,
    private supplierManagementService: SupplierManagementService
  ) {}

  ngOnInit(): void {
    this.addSupplierService.clearAddedSupplier();
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
    this.saveDataForm();
    this.checkSupplierExistance(
      this.addSupplierService.supplierLegalName,
      this.addSupplierService.supplierGstNumber
    );
  }

  /**
   * Cancel the action of adding a new supplier by going back to the suppliers list page
   */
  cancel(): void {
    this.router.navigate([
      '/responder-access/supplier-management/suppliers-list'
    ]);
  }

  get gstNumber(): UntypedFormGroup {
    return this.addForm.get('gstNumber') as UntypedFormGroup;
  }

  /**
   * Checks if the supplier exists in the ERA system
   *
   * @param $event username input change event
   */
  private checkSupplierExistance(
    legalName: string,
    supplierGstNumber: GstNumberModel
  ): void {
    this.showLoader = !this.showLoader;
    const gstNumber: string =
      this.supplierManagementService.convertSupplierGSTNumbertoString(
        supplierGstNumber
      );
    this.supplierService.checkSupplierExists(legalName, gstNumber).subscribe({
      next: (value) => {
        this.showLoader = !this.showLoader;
        if (value.length === 0) {
          this.router.navigate([
            '/responder-access/supplier-management/new-supplier'
          ]);
        } else {
          this.addSupplierService.existingSuppliersList = value;
          this.router.navigate([
            '/responder-access/supplier-management/supplier-exist'
          ]);
        }
      },
      error: (error) => {
        this.showLoader = !this.showLoader;
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.supplierCheckerror);
      }
    });
  }

  /**
   * Creates a new form to handle the addition of new supplier to the system
   */
  private constructAddForm(): void {
    this.addForm = this.builder.group({
      supplierLegalName: ['', [this.customValidation.whitespaceValidator()]],
      supplierName: ['', [this.customValidation.whitespaceValidator()]],
      gstNumber: this.builder.group(
        {
          part1: [
            '',
            [Validators.required, Validators.pattern(globalConst.gstFirstField)]
          ],
          part2: [
            '',
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
      )
    });
  }

  /**
   * Saves the data from the form and save it into the addSUpplier service
   */
  private saveDataForm() {
    this.addSupplierService.supplierLegalName =
      this.addForm.get('supplierLegalName').value;
    this.addSupplierService.supplierName =
      this.addForm.get('supplierName').value;

    const gstNumber: GstNumberModel = {
      part1: this.addForm.get('gstNumber.part1').value,
      part2: this.addForm.get('gstNumber.part2').value
    };
    this.addSupplierService.supplierGstNumber = gstNumber;
  }
}
