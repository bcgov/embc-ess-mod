import { SupplierListItem } from '../api/models';
import { AddressModel } from './address.model';

export interface SupplierListItemModel extends SupplierListItem {
  address: AddressModel;
}
