import { SuppliersListItem } from '../api/models';
import { AddressModel } from './address.model';

export interface SupplierListItemModel extends SuppliersListItem {
  address: AddressModel;
}
