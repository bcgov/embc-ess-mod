import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SupplierService } from 'src/app/core/services/suppliers.service';
import { AddSupplierService } from '../add-supplier/add-supplier.service';
import * as globalConst from '../../../core/services/global-constants';
import { AlertService } from 'src/app/shared/components/alert/alert.service';

@Component({
  selector: 'app-supplier-exist',
  templateUrl: './supplier-exist.component.html',
  styleUrls: ['./supplier-exist.component.scss']
})
export class SupplierExistComponent implements OnInit {
  displayedColumns: string[] = [
    'legalName',
    'name',
    'gstNumber',
    'address',
    'primaryTeam',
    'action'
  ];
  dataSource = new BehaviorSubject([]);
  constructor(
    private addSupplierService: AddSupplierService,
    private supplierService: SupplierService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.dataSource.next(this.addSupplierService.existingSuppliersList);
  }

  /**
   * Navigates to the step 2 of 3 of creating a new supplier
   */
  continue(): void {
    this.router.navigate([
      '/responder-access/supplier-management/new-supplier'
    ]);
  }

  /**
   * Redirects back to the suppliers' list
   */
  close(): void {
    this.addSupplierService.clearAddedSupplier();
    this.router.navigate([
      '/responder-access/supplier-management/suppliers-list'
    ]);
  }

  /**
   * Adds an existing supplier as a main supplier for responder's ESS Team
   *
   * @param $event the supplier object to be claimed as main supplier
   */
  addSupplier($event): void {
    this.supplierService.getSupplierById($event.id).subscribe({
      next: (supplier) => {
        this.router.navigate(
          ['/responder-access/supplier-management/review-supplier'],
          { state: { ...supplier }, queryParams: { action: 'add-existing' } }
        );
      },
      error: (error) => {
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.claimSupplierError);
      }
    });
  }
}
