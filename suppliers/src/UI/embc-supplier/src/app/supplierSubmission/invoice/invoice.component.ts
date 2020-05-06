import { Component, Inject, NgModule, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {

   // supplierForm: FormGroup;
    @Input() formGroupName: number;
    @Input() invoiceForm: FormGroup;
    @Input() index: number;

    constructor(private builder: FormBuilder){ 
    }

    get referrals() {
        return this.invoiceForm.get('referrals') as FormArray;
    }

    createReferralFormArray() {
       return this.builder.group({
            referralNumber : ['']
        })
    }

    injectTemplateReferral() {
        this.referrals.push(this.createReferralFormArray());
    }

    addReferralTemplate() {
        this.injectTemplateReferral();
    }


}

// @NgModule({
//     imports: [
//       CommonModule,
//       ReactiveFormsModule
//     ],
//     declarations: [
//         InvoiceComponent
//       ]
//   })
//   class InvoiceModule { }