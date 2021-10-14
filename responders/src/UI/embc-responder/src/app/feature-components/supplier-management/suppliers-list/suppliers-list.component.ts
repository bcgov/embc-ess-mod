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
import { SupplierDetailService } from '../supplier-detail/supplier-detail.service';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  suppliersList: SupplierListItem[];
  mutualAidList: SupplierListItem[];
  suppliersLoader = false;
  mutualAidLoader = false;
  statusLoading = true;
  loggedInRole: string;

  constructor(
    private listSupplierDataService: SupplierListDataService,
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService,
    private supplierServices: SupplierService,
    private alertService: AlertService
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state;
        this.enableActionNotification(state);
      }
    }
  }

  ngOnInit(): void {
    this.filtersToLoad = this.listSupplierDataService.filtersToLoad;
    this.primarySuppliersColumns = this.listSupplierDataService.primarySupplierColumns;
    this.mutualAidSuppliersColumns = this.listSupplierDataService.mutualAidSupplierColumns;
    this.loggedInRole = this.userService.currentProfile.role;

    this.getPrimarySuppliersList();
    this.getMutualAidSuppliersList();
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
    this.listSupplierDataService.getSupplierDetails($event.id, 'supplier');
  }

  openMutualAidDetails($event: SupplierListItem): void {
    this.listSupplierDataService.getSupplierDetails($event.id, 'mutualAid');
  }

  /**
   * Activates an inactive user
   *
   * @param $event team member id
   */
  activateSupplier($event: string): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: InformationDialogComponent,
          content: globalConst.updateSupplierStatus
        },
        height: '260px',
        width: '600px'
      })
      .afterClosed()
      .subscribe((event) => {
        this.statusLoading = !this.statusLoading;
        if (event === 'confirm') {
          this.supplierServices.activateSuppliersStatus($event).subscribe(
            (value) => {
              this.statusLoading = !this.statusLoading;
              this.suppliersList = value;
            },
            (error) => {
              this.statusLoading = !this.statusLoading;
              this.alertService.clearAlert();
              this.alertService.setAlert(
                'danger',
                globalConst.activateSupplierError
              );
            }
          );
        } else {
          this.statusLoading = !this.statusLoading;
          this.getPrimarySuppliersList();
          this.suppliersLoader = false;
        }
      });
  }

  /**
   * Inactivate an active user
   *
   * @param $event team member id
   */
  deactivateSupplier($event: string): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: InformationDialogComponent,
          content: globalConst.updateSupplierStatus
        },
        height: '260px',
        width: '600px'
      })
      .afterClosed()
      .subscribe((event) => {
        if (event === 'confirm') {
          this.statusLoading = !this.statusLoading;
          this.supplierServices.deactivateSuppliersStatus($event).subscribe(
            (value) => {
              this.statusLoading = !this.statusLoading;
              this.suppliersList = value;
            },
            (error) => {
              this.statusLoading = !this.statusLoading;
              this.alertService.clearAlert();
              this.alertService.setAlert(
                'danger',
                globalConst.deActivateSupplierError
              );
            }
          );
        } else {
          this.statusLoading = !this.statusLoading;
          this.getPrimarySuppliersList();
          this.suppliersLoader = false;
        }
      });
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
      this.listSupplierDataService.openConfirmation(displayText);
    }, 500);
  }

  /**
   * Gets the primary suppliers list from the API
   */
  private getPrimarySuppliersList(): void {
    this.supplierServices.getMainSuppliersList().subscribe(
      (values) => {
        this.suppliersLoader = !this.suppliersLoader;
        this.suppliersList = values;
      },
      (error) => {
        this.suppliersLoader = !this.suppliersLoader;
        this.alertService.clearAlert();
        this.alertService.setAlert(
          'danger',
          globalConst.mainSuppliersListError
        );
      }
    );
  }

  /**
   * Gets the mutual aid suppliers list from the API
   */
  private getMutualAidSuppliersList(): void {
    this.supplierServices.getMutualAidSuppliersList().subscribe(
      (values) => {
        this.mutualAidLoader = !this.mutualAidLoader;
        this.mutualAidList = values;
      },
      (error) => {
        this.mutualAidLoader = !this.mutualAidLoader;
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.mutualAidListError);
      }
    );
  }
}
