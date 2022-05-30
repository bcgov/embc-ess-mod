import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierService } from '../core/services/suppliers.service';
import { SupplierDetailService } from '../feature-components/supplier-management/supplier-detail/supplier-detail.service';
import { AlertService } from '../shared/components/alert/alert.service';

@Injectable({ providedIn: 'root' })
export class MockSupplierDetailService extends SupplierDetailService {
  constructor(
    supplierService: SupplierService,
    router: Router,
    alertService: AlertService
  ) {
    super(supplierService, router, alertService);
  }

  rescindMutualAid(supplierId: string, teamId: string): void {
    this.router.navigate([
      '/responder-access/supplier-management/suppliers-list'
    ]);
  }

  addMutualAid(supplierId: string, teamId: string): void {
    this.router.navigate([
      '/responder-access/supplier-management/suppliers-list'
    ]);
  }
}
