import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { UserService } from 'src/app/core/services/user.service';
import { SupplierListDataService } from './supplier-list-data.service';
import * as globalConst from '../../../core/services/global-constants';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { SupplierListItem } from 'src/app/core/api/models';
import { SupplierService } from 'src/app/core/services/suppliers.service';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddSupplierService } from '../add-supplier/add-supplier.service';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.scss']
})
export class SuppliersListComponent implements OnInit {
  primarySupplierFilterTerm: TableFilterValueModel;
  mutualAidSupplierFilterTerm: TableFilterValueModel;
  filtersToLoad: TableFilterModel;
  primarySuppliersColumns: TableColumnModel[];
  mutualAidSuppliersColumns: TableColumnModel[];
  suppliersList: SupplierListItem[] = [];
  mutualAidList: SupplierListItem[] = [];
  suppliersLoader = false;
  mutualAidLoader = false;
  statusLoading = true;
  loggedInRole: string;
  isLoading = false;

  constructor(
    private supplierListDataService: SupplierListDataService,
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService,
    private supplierServices: SupplierService,
    private alertService: AlertService,
    private addSupplierService: AddSupplierService
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state;
        this.enableActionNotification(state);
      }
    }
  }

  ngOnInit(): void {
    this.addSupplierService.clearAddedSupplier();
    this.filtersToLoad = this.supplierListDataService.filtersToLoad;
    this.primarySuppliersColumns =
      this.supplierListDataService.primarySupplierColumns;
    this.mutualAidSuppliersColumns =
      this.supplierListDataService.mutualAidSupplierColumns;
    this.loggedInRole = this.userService?.currentProfile?.role;

    this.getSuppliersLists();
  }

  /**
   * Sets the user selected filers
   *
   * @param event user selected filters
   */
  primarySupplierFilter(event: TableFilterValueModel): void {
    this.primarySupplierFilterTerm = event;
  }

  /**
   * Sets the user selected filers
   *
   * @param event user selected filters
   */
  mutualAidSupplierFilter(event: TableFilterValueModel): void {
    this.mutualAidSupplierFilterTerm = event;
  }

  /**
   * Sets the selected team member to the services and navigates to the details page
   *
   * @param $event Selected team member object
   */
  openSupplierDetails($event: SupplierListItem): void {
    this.isLoading = true;
    this.supplierListDataService
      .getSupplierDetails($event.id, 'supplier')
      .then(() => {
        this.isLoading = false;
      });
  }

  openMutualAidDetails($event: SupplierListItem): void {
    this.isLoading = true;
    this.supplierListDataService
      .getSupplierDetails($event.id, 'mutualAid')
      .then(() => {
        this.isLoading = false;
      });
  }

  /**
   * Activates an inactive user
   *
   * @param $event team member id
   */
  activateSupplier($event: SupplierListItem): void {
    if ($event.providesMutualAid) {
      this.dialog
        .open(DialogComponent, {
          data: {
            component: InformationDialogComponent,
            content: globalConst.updateSupplierStatus
          },
          width: '600px'
        })
        .afterClosed()
        .subscribe({
          next: (event) => {
            if (event === 'confirm') {
              this.statusLoading = !this.statusLoading;
              this.supplierServices
                .activateSuppliersStatus($event.id)
                .subscribe({
                  next: (value) => {
                    this.statusLoading = !this.statusLoading;
                    this.suppliersList = value;
                  },
                  error: (error) => {
                    this.statusLoading = !this.statusLoading;
                    this.alertService.clearAlert();
                    this.alertService.setAlert(
                      'danger',
                      globalConst.activateSupplierError
                    );
                  }
                });
            } else {
              this.cancelPrimarySuppliersListChanges();
            }
          }
        });
    } else {
      this.statusLoading = !this.statusLoading;
      this.supplierServices.activateSuppliersStatus($event.id).subscribe({
        next: (value) => {
          this.statusLoading = !this.statusLoading;
          this.suppliersList = value;
        },
        error: (error) => {
          this.statusLoading = !this.statusLoading;
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.activateSupplierError
          );
        }
      });
    }
  }

  /**
   * Inactivate an active user
   *
   * @param $event team member id
   */
  deactivateSupplier($event: SupplierListItem): void {
    if ($event.providesMutualAid) {
      this.dialog
        .open(DialogComponent, {
          data: {
            component: InformationDialogComponent,
            content: globalConst.updateSupplierStatus
          },
          width: '600px'
        })
        .afterClosed()
        .subscribe({
          next: (event) => {
            if (event === 'confirm') {
              this.statusLoading = !this.statusLoading;
              this.supplierServices
                .deactivateSuppliersStatus($event.id)
                .subscribe({
                  next: (value) => {
                    this.statusLoading = !this.statusLoading;
                    this.suppliersList = value;
                  },
                  error: (error) => {
                    this.statusLoading = !this.statusLoading;
                    this.alertService.clearAlert();
                    this.alertService.setAlert(
                      'danger',
                      globalConst.deActivateSupplierError
                    );
                  }
                });
            } else {
              this.cancelPrimarySuppliersListChanges();
            }
          }
        });
    } else {
      this.statusLoading = !this.statusLoading;
      this.supplierServices.deactivateSuppliersStatus($event.id).subscribe({
        next: (value) => {
          this.statusLoading = !this.statusLoading;
          this.suppliersList = value;
        },
        error: (error) => {
          this.statusLoading = !this.statusLoading;
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.deActivateSupplierError
          );
        }
      });
    }
  }

  /**
   * Navigates to add team member page
   */
  addSupplier(): void {
    this.router.navigate([
      '/responder-access/supplier-management/add-supplier'
    ]);
  }

  /**
   * Populates action basec notification and open confirmation box
   *
   * @param state navigation state string
   */
  enableActionNotification(state: { [k: string]: any }): void {
    let displayText: DialogContent;
    if (state?.action === 'delete') {
      displayText = globalConst.deleteSupplierMessage;
    } else if (state?.action === 'edit') {
      displayText = globalConst.editSupplierMessage;
    } else {
      displayText = globalConst.addSupplierMessage;
    }
    setTimeout(() => {
      this.supplierListDataService.openConfirmation(displayText);
    }, 500);
  }

  /**
   * Gets the suppliers list from the API
   */
  private getSuppliersLists(): void {
    this.supplierServices.getSuppliersList().subscribe({
      next: (allSuppliers) => {
        this.suppliersLoader = !this.suppliersLoader;
        this.suppliersList = allSuppliers.filter((supplier) => {
          return supplier.isPrimarySupplier === true;
        });
        this.mutualAidLoader = !this.mutualAidLoader;
        this.mutualAidList = allSuppliers.filter((supplier) => {
          return supplier.isPrimarySupplier === false;
        });
      },
      error: (error) => {
        this.suppliersLoader = !this.suppliersLoader;
        this.alertService.clearAlert();
        this.alertService.setAlert(
          'danger',
          globalConst.mainSuppliersListError
        );
      }
    });
  }

  /**
   * If the user cancels activation of deactivation of any Primary Supplier, the list is restored before changes has been made.
   */
  private cancelPrimarySuppliersListChanges(): void {
    this.statusLoading = !this.statusLoading;
    this.supplierServices.getMainSuppliersList().subscribe({
      next: (values) => {
        this.statusLoading = !this.statusLoading;
        this.suppliersList = values;
      },
      error: (error) => {
        this.statusLoading = !this.statusLoading;
        this.alertService.clearAlert();
        this.alertService.setAlert(
          'danger',
          globalConst.mainSuppliersListError
        );
      }
    });
  }
}
