import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../service/supplier.service';
import { Router } from '@angular/router';

@Component({
    selector: 'reference',
    templateUrl: './reference.component.html',
    styleUrls: ['./reference.component.scss']
})
export class ReferenceComponent implements OnInit{

    referenceNumber: any;
   
    constructor(public supplierService: SupplierService, private router: Router) { }

    ngOnInit() {
        this.referenceNumber = this.supplierService.getReferenceNumber();
    }

}