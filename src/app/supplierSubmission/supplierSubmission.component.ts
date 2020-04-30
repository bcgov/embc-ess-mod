import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
    selector: 'supplier-submission',
    templateUrl: './supplierSubmission.component.html',
    styleUrls: ['./supplierSubmission.component.scss']
})
export class SupplierSubmissionComponent {

    constructor(private router: Router, private builder: FormBuilder) { }

    supplierForm = this.builder.group({
        supplierLegalName: [''],
        supplierName: [''],
        location: [''],
        gstNumber: [''],
        remitToOtherBusiness: [''],

        address: this.builder.group({
            address1: [''],
            address2: [''],
            city: [''],
            province: ['British Columbia'],
            postalCode: [''],
            country: ['Canada'],
        }),

        contactPerson: this.builder.group({
            firstName: [''],
            lastName: [''],
            email: [''],
            phone: [''],
            fax: [''],
        })
    });

    onSubmit() {
        console.warn(this.supplierForm.value);
        this.router.navigate(['/review']);
    }

}