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
import { Team } from 'src/app/core/api/models';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import * as globalConst from '../../../core/services/global-constants';

@Injectable({ providedIn: 'root' })
export class SupplierListDataService {
  public filtersToLoad: TableFilterModel = {
    loadDropdownFilters: [],
    loadInputFilter: {
      type: 'Search by supplier name or supplier legal name',
      label: 'Search by supplier name or supplier legal name'
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
    { label: 'Mutual Aid Provided by', ref: 'mutualAid' },
    { label: 'Status', ref: 'status' }
  ];

  private selectedSupplier: SupplierModel;
  private nonMutualAidEssTeams: Team[];

  constructor(
    private cacheService: CacheService,
    private router: Router,
    private supplierServices: SupplierService,
    private dialog: MatDialog,
    private alertService: AlertService
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
   * Gets the ESS Teams that currently are not associated as Mutual Aid to the selected supplier
   *
   * @returns a list of ESS Teams that are not mutual Aid to the selected supplier
   */
  public getNonMutualAidTeams(): Team[] {
    return this.nonMutualAidEssTeams || [];
  }

  /**
   * Sets a list of ESS Teams that are not associated as Mutual Aid to the selected supplier
   *
   * @param teams a list of ESS Teams that are not mutual Aid to the selected supplier
   */
  public setNonMutualAidTeams(teams: Team[]) {
    this.nonMutualAidEssTeams = teams;
  }

  /**
   * Cleans data of the selected supplier
   */
  clearSupplierData(): void {
    this.selectedSupplier = undefined;
    this.cacheService.remove('selectedSupplier');
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
  getSupplierDetails(supplierId: string, viewType: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      this.supplierServices.getSupplierById(supplierId).subscribe({
        next: async (supplier) => {
          this.setSelectedSupplier(supplier);
          const essTeamsList: Team[] =
            await this.supplierServices.getMutualAidEssTeamsList();
          const filteredEssTeams = this.filterEssTeams(essTeamsList);
          this.setNonMutualAidTeams(filteredEssTeams);

          this.router.navigate(
            ['/responder-access/supplier-management/supplier-detail'],
            { queryParams: { type: viewType } }
          );
          resolve();
        },
        error: (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.getSupportByIdError);
        }
      });
    });
  }

  /**
   * Filters ESS Teams that are already associated as Mutual Aid to the selected supplier
   *
   * @param allEssTeamList All ESs Team existing in ERA system
   * @param supplierMutualAidList ESS Teams already asociated to the selected supplier
   * @returns a list of ESS Teams that has no mutual Aid relationship with the selected supplier
   */
  public filterEssTeams(allEssTeamList: Team[]): Team[] {
    let filteredEssTeams: Team[] = [];

    // Filtering the ESS Teams that already has a mutual Aid relationship with this supplier
    filteredEssTeams = allEssTeamList.filter((e) => {
      return !this.selectedSupplier.mutualAids.find((item) => {
        return item.givenByTeamId === e.id;
      });
    });

    // Filtering the main ESS Team from the list
    filteredEssTeams = filteredEssTeams.filter((e) => {
      return this.selectedSupplier?.primaryTeams?.find(
        (team) => e.id !== team?.id
      );
    });
    return filteredEssTeams;
  }
}
