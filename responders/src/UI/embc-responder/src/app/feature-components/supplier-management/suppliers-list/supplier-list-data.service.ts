import { Injectable } from '@angular/core';
import { AddressModel } from 'src/app/core/models/address.model';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { CacheService } from 'src/app/core/services/cache.service';

export interface SupplierTemp {
  legalName: string;
  name: string;
  address: AddressModel;
  isMutualAid: boolean;
  isActive: boolean;
  gstNumber: string;
  primaryContact: SupplierContact;
}

export interface SupplierContact {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class SupplierListDataService {
  public filtersToLoad: TableFilterModel = {
    loadDropdownFilters: [],
    loadInputFilter: {
      type: 'Search by supplier name/ legal name',
      label: 'Search by supplier name/ legal name'
    }
  };

  public displayedColumns: TableColumnModel[] = [
    { label: 'Supplier Legal Name', ref: 'legalName' },
    { label: 'Supplier Name', ref: 'name' },
    { label: 'Address', ref: 'address' },
    { label: 'Mutual Aid', ref: 'isMutualAid' },
    { label: 'Status', ref: 'isActive' }
  ];

  private selectedSupplierVal: SupplierTemp;

  constructor() {}

  public get selectedSupplier(): SupplierTemp {
    return this.selectedSupplierVal;
  }

  public set selectedSupplier(selectedSupplierVal: SupplierTemp) {
    this.selectedSupplierVal = selectedSupplierVal;
  }

  clearSupplierData(): void {
    this.selectedSupplier = undefined;
  }
}
