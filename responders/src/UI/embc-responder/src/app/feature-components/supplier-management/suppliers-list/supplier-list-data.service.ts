import { Injectable } from '@angular/core';
import { AddressModel } from 'src/app/core/models/address.model';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { CacheService } from 'src/app/core/services/cache.service';

export interface SupplierTemp {
  id?: string;
  legalName: string;
  name: string;
  address: AddressModel;
  isMutualAid: boolean;
  isActive: boolean;
  gstNumber: GstModel;
  primaryContact: SupplierContact;
}

export interface SupplierContact {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export interface GstModel {
  part1: string;
  part2: string;
}

export interface ExistingSupplier {
  legalName: string;
  name: string;
  gstNumber: GstModel;
  address: AddressModel;
  primaryTeam: null | string;
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

  public primarySupplierColumns: TableColumnModel[] = [
    { label: 'Supplier Legal Name', ref: 'legalName' },
    { label: 'Supplier Name', ref: 'name' },
    { label: 'Address', ref: 'address' },
    { label: 'Mutual Aid', ref: 'isMutualAid' },
    { label: 'Status', ref: 'isActive' }
  ];

  public mutualAidSupplierColumns: TableColumnModel[] = [
    { label: 'Supplier Legal Name', ref: 'legalName' },
    { label: 'Supplier Name', ref: 'name' },
    { label: 'Address', ref: 'address' },
    { label: 'Mutual Aid Provided by', ref: 'isMutualAid' },
    { label: 'Status', ref: 'isActive' }
  ];

  private selectedSupplier: SupplierTemp;

  constructor(private cacheService: CacheService) {}

  /**
   * get the selected supplier
   *
   * @returns the selected supplier
   */
  public getSelectedSupplier(): SupplierTemp {
    return this.selectedSupplier
      ? this.selectedSupplier
      : JSON.parse(this.cacheService.get('selectedSupplier'));
  }

  /**
   * Sets a selected supplier
   *
   * @param selectedSupplier
   */
  public setSelectedSupplier(selectedSupplier: SupplierTemp) {
    this.cacheService.set('selectedSupplier', selectedSupplier);
    this.selectedSupplier = selectedSupplier;
  }

  /**
   * Cleans data of the selected supplier
   */
  clearSupplierData(): void {
    this.selectedSupplier = undefined;
    this.cacheService.remove('selectedSupplier');
  }
}
