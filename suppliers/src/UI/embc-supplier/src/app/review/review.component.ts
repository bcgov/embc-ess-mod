import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../service/supplier.service';
import { Router } from '@angular/router';
import { SupplierHttpService } from '../service/supplierHttp.service';

@Component({
    selector: 'review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit{

    supplierSubmissionType: string;
    supplier: any;
   
    constructor(public supplierService: SupplierService, private router: Router, private httpService: SupplierHttpService) { }

    ngOnInit() {
        this.supplier = this.supplierService.getSupplierDetails();
        this.supplierSubmissionType = this.supplier.supplierSubmissionType;
        console.log(this.supplier);
    }

    goback() {
        this.router.navigate(['/submission']);
    }

    submit() {
        console.log("on submit click")
        this.httpService.submitForm(this.supplierService.getPayload()).subscribe((res: any) => {
            console.log(res);
            this.supplierService.setReferenceNumber(res);
            this.router.navigate(['/thankyou']);
        })
    }

}