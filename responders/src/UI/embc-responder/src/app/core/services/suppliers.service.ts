import { Injectable } from '@angular/core';
import { GstNumberModel } from '../models/gst-number.model';
import { SupplierModel } from '../models/supplier.model';
import { LocationsService } from './locations.service';
import { SuppliersService } from '../api/services';
import { Observable } from 'rxjs/internal/Observable';
import { Supplier, SupplierResult } from '../api/models';
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
   * Gives an array of Suppliers Search Results
   *
   * @returns an array of Supplier Search Results
   */
  getSuppliersList(): Observable<Array<SupplierModel>> {
    const suppliersModelArray: Array<SupplierModel> = [];
    return this.suppliersService.suppliersGetSuppliers().pipe(
      map(
        (suppliers: Array<Supplier>): Array<SupplierModel> => {
          suppliers.forEach((supplier) => {
            const convertedSupplier: SupplierModel = {
              ...supplier,
              address: this.locationServices.getAddressModelFromAddress(
                supplier.address
              ),
              supplierGstNumber: this.supplierManagementService.convertSupplierGSTNumberFromGSTNumber(
                supplier.gstNumber
              )
            };
            suppliersModelArray.push(convertedSupplier);
          });
          return suppliersModelArray;
        }
      )
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
  ): Observable<Array<SupplierModel>> {
    return this.suppliersService
      .suppliersSetSupplierStatus({
        supplierId,
        status
      })
      .pipe(
        mergeMap((result) => {
          console.log(result);
          return this.getSuppliersList();
        })
      );
  }
}
