import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierService } from 'src/app/core/services/suppliers.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import * as globalConst from '../../../core/services/global-constants';

@Injectable({
  providedIn: 'root'
})
export class SupplierDetailService {
  constructor(
    private supplierService: SupplierService,
    protected router: Router,
    private alertService: AlertService
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
      .subscribe({
        next: (result) => {
          this.router.navigate([
            '/responder-access/supplier-management/suppliers-list'
          ]);
        },
        error: (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.rescindSupplierError
          );
        }
      });
  }

  addMutualAid(supplierId: string, teamId: string): void {
    this.supplierService.addMutualAidSupplier(supplierId, teamId).subscribe({
      next: (result) => {
        this.router.navigate([
          '/responder-access/supplier-management/suppliers-list'
        ]);
      },
      error: (error) => {
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.addSupplierError);
      }
    });
  }
}
