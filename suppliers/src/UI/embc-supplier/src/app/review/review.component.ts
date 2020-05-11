import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../service/supplier.service';

@Component({
    selector: 'review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit{

    supplierSubmissionType = "I"
    supplier: any;
   
    constructor(public supplierService: SupplierService) { }

    ngOnInit() {
        this.supplier = this.supplierService.getSupplierDetails()

    }

}