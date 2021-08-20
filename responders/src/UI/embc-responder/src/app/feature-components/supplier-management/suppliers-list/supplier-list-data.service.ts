import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierService } from 'src/app/core/services/suppliers.service';
import { SupplierModel } from 'src/app/core/models/supplier.model';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(
    private cacheService: CacheService,
    private router: Router,
    private supplierServices: SupplierService,
    private dialog: MatDialog
  ) {}

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

  /**
   * Open confirmation modal window
   *
   * @param text text to display
   */
   openConfirmation(content: DialogContent): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content
      },
      width: '530px'
    });
  }

  /**
   * Gets the supplier's details from the backend
   *
   * @param supplierId the supplier's id
   * @param viewType the type of view to be rendered whether the details dsplayed are from a main supplier or a mutual aid.
   */
  getSupplierDetails(supplierId: string, viewType: string): void {
    this.supplierServices.getSupplierById(supplierId).subscribe((supplier) => {
      console.log(supplier);
      this.setSelectedSupplier(supplier);

      this.router.navigate(
        ['/responder-access/supplier-management/supplier-detail'],
        { queryParams: { type: viewType } }
      );
    });
  }
}
