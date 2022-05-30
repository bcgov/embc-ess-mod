import { Injectable } from '@angular/core';
import { Supplier } from '../../core/api/models/supplier';
import { GstNumberModel } from '../../core/models/gst-number.model';
import { SupplierModel } from '../../core/models/supplier.model';
import { LocationsService } from '../../core/services/locations.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierManagementService {
  constructor(private locationServices: LocationsService) {}

  convertSupplierGSTNumberToFormModel(gstNumber: string): GstNumberModel {
    const gstArray: string[] = gstNumber.split('-RT-', 2);
    const convertedGstNumber: GstNumberModel = {
      part1: gstArray[0],
      part2: gstArray[1]
    };

    return convertedGstNumber;
  }

  convertSupplierGSTNumbertoString(supplierGstNumber: GstNumberModel): string {
    return supplierGstNumber.part1 + '-RT-' + supplierGstNumber.part2;
  }

  getSupplierModelFromSupplier(supplier: Supplier): SupplierModel {
    return {
      ...supplier,
      supplierGstNumber: this.convertSupplierGSTNumberToFormModel(
        supplier.gstNumber
      ),
      address: this.locationServices.getAddressModelFromAddress(
        supplier.address
      )
    };
  }
}
