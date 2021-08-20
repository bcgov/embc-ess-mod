import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { UserService } from 'src/app/core/services/user.service';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { SupplierListDataService } from './supplier-list-data.service';
import * as globalConst from '../../../core/services/global-constants';
import { SupplierService } from 'src/app/core/services/suppliers.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { SupplierModel } from 'src/app/core/models/supplier.model';
import { SupplierListItem } from 'src/app/core/api/models';

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
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog,
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

    this.supplierServices.getMainSuppliersList().subscribe(
      (values) => {
        console.log(values);
        this.mutualAidLoader = !this.mutualAidLoader;
        this.suppliersList = values;
      },
      (error) => {
        console.log(error);
        this.mutualAidLoader = !this.mutualAidLoader;
        this.alertService.clearAlert();
        this.alertService.setAlert(
          'danger',
          globalConst.mainSuppliersListError
        );
      }
    );

    this.supplierServices.getMutualAidSuppliersList().subscribe(
      (values) => {
        console.log(values);
        this.suppliersLoader = !this.suppliersLoader;
        this.mutualAidList = values;
      },
      (error) => {
        console.log(error);
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
  openSupplierDetails($event: SupplierModel): void {
    this.listSupplierDataService.setSelectedSupplier($event);
    this.router.navigate(
      ['/responder-access/supplier-management/supplier-detail'],
      { state: { ...$event }, queryParams: { type: 'supplier' } }
    );
  }

  openMutualAidDetails($event: SupplierModel): void {
    this.listSupplierDataService.setSelectedSupplier($event);
    this.router.navigate(
      ['/responder-access/supplier-management/supplier-detail'],
      { state: { ...$event }, queryParams: { type: 'mutualAid' } }
    );
  }

  /**
   * Activates/ Deactivates a main supplier
   *
   * @param $event team member id
   */
  changeSupplierStatus($event: { id: string; status: boolean }): void {
    this.statusLoading = !this.statusLoading;
    console.log($event);

    this.supplierServices
      .setSuppliersStatus($event.id, $event.status)
      .subscribe(
        (value) => {
          this.statusLoading = !this.statusLoading;
          this.suppliersList = value;
          console.log(value);
        },
        (error) => {
          this.statusLoading = !this.statusLoading;
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.changeSupplierStatusError
          );
        }
      );
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
      this.openConfirmation(displayText);
    }, 500);
  }

  /**
   * Open confirmation modal window
   *
   * @param text text to display
   */
  private openConfirmation(content: DialogContent): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content
      },
      width: '530px'
    });
  }
}
