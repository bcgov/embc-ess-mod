import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CreateSupplierRequest, CreateSupplierResponse } from "../../core/api/models";
import { MockCasService } from "../../core/api/services";

@Component({
    selector: 'add-supplier.dialog',
    templateUrl: 'add-supplier.dialog.html',
    styleUrls: ['./add-supplier.dialog.scss']
})
export class AddSupplierDialog implements OnInit {
    supplierForm: FormGroup;
    saving: boolean = false;
    showErrorMessage: boolean = false;
    constructor(public dialogRef: MatDialogRef<AddSupplierDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private mockCasService: MockCasService
    ) {

    }

    ngOnInit(): void {
        this.supplierForm = this.fb.group({
            supplierName: ['', [Validators.required]],
            subCategory: ['', [Validators.required]],
            sin: [''],
            businessNumber: [''],
            supplierAddress: this.fb.array([]),
        });

        this.addAddress();
    }

    get supplierAddress() {
        return this.supplierForm.controls["supplierAddress"] as FormArray;
    }

    addAddress() {
        const addressForm = this.fb.group({
            addressLine1: ['', Validators.required],
            city: ['', Validators.required],
            postalCode: ['', Validators.required],
            province: ['BC', Validators.required],
            country: ['Canada', Validators.required],
            suppliersitecode: ['001']
        });
        this.supplierAddress.push(addressForm);
    }

    deleteAddress(index: number) {
        this.supplierAddress.removeAt(index);
    }

    save() {
        if (!this.supplierForm.valid) {
            this.showErrorMessage = true;
        }
        else {
            this.showErrorMessage = false;
            this.saving = true;
            const supplier: CreateSupplierRequest = this.supplierForm.getRawValue();
            this.mockCasService.mockCasCreateSupplier({ body: supplier }).subscribe({
                next: (res: CreateSupplierResponse) => {
                    this.saving = false;
                    if (res["CAS-Returned-Messages"] === "SUCCEEDED") {
                        this.dialogRef.close("created");
                    }
                    else {
                        console.log(res);
                    }
                    //   this.loadInvoices();
                },
                error: (err: any) => {
                    this.saving = false;
                    console.log(err);
                }
            });
        }
    }

    close() {
        this.dialogRef.close();
    }
}