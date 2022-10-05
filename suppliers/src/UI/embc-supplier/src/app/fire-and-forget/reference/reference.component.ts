import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../core/services/supplier.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss']
})
export class ReferenceComponent implements OnInit {
  referenceNumber: any;

  constructor(
    public supplierService: SupplierService,
    private router: Router
  ) {}

  ngOnInit() {
    this.referenceNumber = this.supplierService.getReferenceNumber();
  }

  newSubmission() {
    this.supplierService.setSupplierDetails(null);
    this.router.navigate(['/submission']);
  }
}
