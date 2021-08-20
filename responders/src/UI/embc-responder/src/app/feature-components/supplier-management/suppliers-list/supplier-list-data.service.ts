import { Injectable } from '@angular/core';
import { AddressModel } from 'src/app/core/models/address.model';
import { GstNumberModel } from 'src/app/core/models/gst-number.model';
import { SupplierModel } from 'src/app/core/models/supplier.model';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { CacheService } from 'src/app/core/services/cache.service';

export interface ExistingSupplier {
  legalName: string;
  name: string;
  gstNumber: GstNumberModel;
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
    { label: 'Mutual Aid', ref: 'providesMutualAid' },
    { label: 'Status', ref: 'status' }
  ];

  public mutualAidSupplierColumns: TableColumnModel[] = [
    { label: 'Supplier Legal Name', ref: 'legalName' },
    { label: 'Supplier Name', ref: 'name' },
    { label: 'Address', ref: 'address' },
    { label: 'Mutual Aid Provided by', ref: 'team' },
    { label: 'Status', ref: 'status' }
  ];

  private selectedSupplier: SupplierModel;
  private mainSuppliersList: Array<SupplierModel>;
  private mutualAidSuppliersList: Array<SupplierModel>;

  constructor(private cacheService: CacheService) {}

  /**
   * get the selected supplier
   *
   * @returns the selected supplier
   */
  public getSelectedSupplier(): SupplierModel {
    return this.selectedSupplier
      ? this.selectedSupplier
      : JSON.parse(this.cacheService.get('selectedSupplier'));
  }

  /**
   * Sets a selected supplier
   *
   * @param selectedSupplier
   */
  public setSelectedSupplier(selectedSupplier: SupplierModel) {
    this.cacheService.set('selectedSupplier', selectedSupplier);
    this.selectedSupplier = selectedSupplier;
  }

  /**
   * Gets the main suppliers list
   *
   * @returns an array of main suppliers
   */
  public getMainSuppliersList(): Array<SupplierModel> {
    return this.mainSuppliersList;
  }

  /**
   * Sets an array of suppliers as primary suppliers
   *
   * @param suppliersList the list of suppliers to assign as primary suppliers
   */
  public setMainSuppliersList(suppliersList: Array<SupplierModel>): void {
    this.mainSuppliersList = suppliersList;
  }

  /**
   * Gets the mutual Aid Suppliers list
   *
   * @returns an array of mutual aid suppliers
   */
  public getMutualAidSuppliersList(): Array<SupplierModel> {
    return this.mutualAidSuppliersList;
  }

  /**
   * Sets an array of suppliers as mutual aid
   *
   * @param suppliersList the list of suppliers to assign as mutual aid suppliers
   */
  public setMutualAidSuppliersList(suppliersList: Array<SupplierModel>): void {
    this.mutualAidSuppliersList = suppliersList;
  }

  /**
   * Cleans data of the selected supplier
   */
  clearSupplierData(): void {
    this.selectedSupplier = undefined;
    this.cacheService.remove('selectedSupplier');
    this.mainSuppliersList = undefined;
    this.mutualAidSuppliersList = undefined;
  }
}
