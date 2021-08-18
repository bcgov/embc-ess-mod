import { Supplier } from '../api/models/supplier';
import { AddressModel } from './address.model';
import { GstNumberModel } from './gst-number.model';

export interface SupplierModel extends Supplier {
  address: AddressModel;
  supplierGstNumber: GstNumberModel;
}
