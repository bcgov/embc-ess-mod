import { Injectable } from '@angular/core';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { CacheService } from 'src/app/core/services/cache.service';

export interface SupplierTemp {
  legalName: string;
  name: string;
  address: string;
  isMutualAid: boolean;
  isActive: boolean;
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

  private selectedSupplier: SupplierTemp;

  constructor(private cacheService: CacheService) {}

  public getSelectedSupplier(): SupplierTemp {
    return this.selectedSupplier
      ? this.selectedSupplier
      : JSON.parse(this.cacheService.get('selectedSupplier'));
  }

  public setSelectedSupplier(selectedSupplier: SupplierTemp): void {
    this.cacheService.set('selectedSupplier', selectedSupplier);
    this.selectedSupplier = selectedSupplier;
  }

  clear(): void {
    this.cacheService.remove('selectedSupplier');
  }
}
