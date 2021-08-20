/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Injectable } from '@angular/core';
import { GstNumberModel } from '../models/gst-number.model';
import { SupplierModel } from '../models/supplier.model';
import { LocationsService } from './locations.service';
import { SuppliersService } from '../api/services';
import { Observable } from 'rxjs/internal/Observable';
import { Supplier, SupplierListItem, SupplierResult } from '../api/models';
import { StrictHttpResponse } from '../api/strict-http-response';
import { map, mergeMap } from 'rxjs/operators';
import { SupplierManagementService } from 'src/app/feature-components/supplier-management/supplier-management.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  constructor(
    private locationServices: LocationsService,
    private suppliersService: SuppliersService,
    private supplierManagementService: SupplierManagementService
  ) {}

  /**
   * Gives an array of Main Suppliers
   *
   * @returns an array of Main Supplier
   */
  getMainSuppliersList(
    legalName?: string,
    gstNumber?: string
  ): Observable<Array<SupplierListItem>> {
    const suppliersListArray: Array<SupplierListItem> = [];
    return this.suppliersService
      .suppliersGetSuppliers({
        legalName,
        gstNumber
      })
      .pipe(
        map((suppliers: Array<SupplierListItem>) => {
          return suppliers.filter((supplier) => {
            return supplier.isPrimarySupplier === true;
          });
        })
      );
  }

  /**
   * Gives an array of Mutual Aid Suppliers
   *
   * @returns an array of Mutual Aid Suppliers
   */
  getMutualAidSuppliersList(
    legalName?: string,
    gstNumber?: string
  ): Observable<Array<SupplierListItem>> {
    const suppliersListArray: Array<SupplierListItem> = [];
    return this.suppliersService
      .suppliersGetSuppliers({
        legalName,
        gstNumber
      })
      .pipe(
        map((suppliers: Array<SupplierListItem>) => {
          return suppliers.filter((supplier) => {
            return supplier.isPrimarySupplier === false;
          });
        })
      );
  }

  /**
   * Allows to change the status of a supplier
   *
   * @param supplierId the supplier's ID
   * @param status the supplier's new status
   * @returns Supplier's new details
   */
  setSuppliersStatus(
    supplierId: string,
    status: boolean
  ): Observable<Array<SupplierListItem>> {
    return this.suppliersService
      .suppliersSetSupplierStatus({
        supplierId,
        status
      })
      .pipe(
        mergeMap((result) => {
          console.log(result);
          return this.getMainSuppliersList();
        })
      );
  }
}
