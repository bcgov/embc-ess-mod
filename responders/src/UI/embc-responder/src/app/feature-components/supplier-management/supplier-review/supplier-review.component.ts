import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SupplierListDataService,
  SupplierTemp
} from '../suppliers-list/supplier-list-data.service';

@Component({
  selector: 'app-supplier-review',
  templateUrl: './supplier-review.component.html',
  styleUrls: ['./supplier-review.component.scss']
})
export class SupplierReviewComponent implements OnInit {
  selectedSupplier: SupplierTemp;
  reviewAction: string;

  constructor(
    private supplierListDataService: SupplierListDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    if (params) {
      this.reviewAction = params.action;
    }
    this.selectedSupplier = this.supplierListDataService.selectedSupplier;
  }

  back(): void {
    this.router.navigate([
      '/responder-access/supplier-management/edit-supplier'
    ]);
  }

  save(): void {
    if (this.reviewAction === 'edit') {
      this.router.navigate([
        '/responder-access/supplier-management/supplier-detail'
      ]);
    } else if (this.reviewAction === 'add') {
      this.router.navigate([
        '/responder-access/supplier-management/suppliers-list'
      ]);
    }
  }
}
