import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Team } from 'src/app/core/api/models';
import { CacheService } from 'src/app/core/services/cache.service';
import { SupplierService } from 'src/app/core/services/suppliers.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierDetailService {
  constructor(
    private supplierService: SupplierService,
    private router: Router
  ) {}

  /**
   * Rescinds the relationship as mutual Aid between the given supplier and given ESS Team
   *
   * @param supplierId the supplier's ID
   * @param teamId the ESS Team;s ID
   */
  rescindMutualAid(supplierId: string, teamId: string): void {
    this.supplierService
      .rescindMutualAidSupplier(supplierId, teamId)
      .subscribe((result) => {
        this.router.navigate([
          '/responder-access/supplier-management/suppliers-list'
        ]);
      });
  }

  addMutualAid(supplierId: string, teamId: string): void {
    this.supplierService
      .addMutualAidSupplier(supplierId, teamId)
      .subscribe((result) => {
        this.router.navigate([
          '/responder-access/supplier-management/suppliers-list'
        ]);
      });
  }
}
