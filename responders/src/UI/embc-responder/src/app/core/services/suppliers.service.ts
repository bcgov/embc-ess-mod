/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Injectable } from '@angular/core';
import { SupplierModel } from '../models/supplier.model';
import { LocationsService } from './locations.service';
import { SuppliersService } from '../api/services';
import { Observable } from 'rxjs/internal/Observable';
import { Supplier, SuppliersListItem } from '../api/models';
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
  ): Observable<Array<SuppliersListItem>> {
    return this.suppliersService
      .suppliersGetSuppliers({
        legalName,
        gstNumber
      })
      .pipe(
        map((suppliers: Array<SuppliersListItem>) => {
          return suppliers.filter((supplier) => {
           // return supplier.isPrimarySupplier === true;
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
  ): Observable<Array<SuppliersListItem>> {
    return this.suppliersService
      .suppliersGetSuppliers({
        legalName,
        gstNumber
      })
      .pipe(
        map((suppliers: Array<SuppliersListItem>) => {
          return suppliers.filter((supplier) => {
           // return supplier.isPrimarySupplier === false;
          });
        })
      );
  }

  /**
   *
   * @param legalName supplier's legal name
   * @param gstNumber supplier's gst number
   * @returns an array of suppliers that match with the inserted input
   */
  checkSupplierExists(
    legalName?: string,
    gstNumber?: string
  ): Observable<Array<SuppliersListItem>> {
    return this.suppliersService.suppliersGetSuppliers({
      legalName,
      gstNumber
    });
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
  ): Observable<Array<SuppliersListItem>> {
    return null
    // this.suppliersService
    //   .suppliersSetSupplierStatus({
    //     supplierId,
    //     status
    //   })
    //   .pipe(
    //     mergeMap((result) => {
    //       console.log(result);
    //       return this.getMainSuppliersList();
    //     })
    //   );
  }

  /**
   * Gets the supplier's details based on the given ID
   *
   * @param supplierId the supplier's ID
   * @returns a SupplierModel object
   */
  getSupplierById(supplierId: string): Observable<SupplierModel> {
    return null
    // this.suppliersService.suppliersGetSupplierById({ supplierId }).pipe(
    //   map(
    //     (supplier: Supplier): SupplierModel => {
    //       const supplierModel = {
    //         ...supplier,
    //         supplierGstNumber: this.supplierManagementService.convertSupplierGSTNumberToFormModel(
    //           supplier.gstNumber
    //         ),
    //         address: this.locationServices.getAddressModelFromAddress(
    //           supplier.address
    //         )
    //       };

    //       return supplierModel;
    //     }
    //   )
    // );
  }
}
