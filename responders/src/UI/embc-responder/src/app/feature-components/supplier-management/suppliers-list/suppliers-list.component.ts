import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { UserService } from 'src/app/core/services/user.service';
import { SupplierListDataService } from './supplier-list-data.service';
import { SupplierTemp } from './supplier-list-data.service';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.scss']
})
export class SuppliersListComponent implements OnInit {
  suppliersListData: SupplierTemp[] = [
    {
      legalName: 'Save-on-Foods Ltd',
      name: 'SAVE-ON-FOODS',
      address: '120 Main Street',
      isMutualAid: true,
      isActive: true
    },
    {
      legalName: 'Master Foods',
      name: 'FRESH FOODS',
      address: '23 Wilson Street',
      isMutualAid: false,
      isActive: true
    },
    {
      legalName: 'Hotels Inc.',
      name: 'SLEEP EASY HOTEL',
      address: '970 Douglas Street',
      isMutualAid: false,
      isActive: false
    },
    {
      legalName: 'Victoria Cabs',
      name: 'VICTORIA CABS',
      address: '647 Rose Street',
      isMutualAid: false,
      isActive: false
    }
  ];

  filterTerm: TableFilterValueModel;
  filtersToLoad: TableFilterModel;
  displayedColumns: TableColumnModel[];
  suppliersList: SupplierTemp[];
  isLoading = false;
  statusLoading = true;
  loggedInRole: string;

  constructor(
    private listSupplierDataService: SupplierListDataService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.filtersToLoad = this.listSupplierDataService.filtersToLoad;
    this.displayedColumns = this.listSupplierDataService.displayedColumns;
    this.loggedInRole = this.userService.currentProfile.role;

    setTimeout(() => {
      this.suppliersList = this.suppliersListData;
      this.isLoading = !this.isLoading;
    }, 5000);
  }

  /**
   * Sets the user selected filers
   *
   * @param event user selected filters
   */
  filter(event: TableFilterValueModel): void {
    this.filterTerm = event;
  }

  /**
   * Sets the selected team member to the services and navigates to the details page
   *
   * @param $event Selected team member object
   */
  openSupplierDetails($event: SupplierTemp): void {
    this.listSupplierDataService.setSelectedSupplier($event);
    this.router.navigate(
      ['/responder-access/supplier-management/supplier-detail'],
      {
        state: $event
      }
    );
  }

  /**
   * Activates an inactive user
   *
   * @param $event team member id
   */
  activateSupplier($event: string): void {
    // this.statusLoading = !this.statusLoading;
    // this.teamListService.activateTeamMember($event).subscribe(
    //   (value) => {
    //     this.statusLoading = !this.statusLoading;
    //     this.teamMembers = value;
    //   },
    //   (error) => {
    //     this.statusLoading = !this.statusLoading;
    //     this.alertService.clearAlert();
    //     this.alertService.setAlert(
    //       'danger',
    //       globalConst.activateTeamMemberError
    //     );
    //   }
    // );
  }

  /**
   * Inactivate an active user
   *
   * @param $event team member id
   */
  deactivateSupplier($event: string): void {
    // this.statusLoading = !this.statusLoading;
    // this.teamListService.deactivatedTeamMember($event).subscribe(
    //   (value) => {
    //     this.statusLoading = !this.statusLoading;
    //     this.teamMembers = value;
    //   },
    //   (error) => {
    //     this.statusLoading = !this.statusLoading;
    //     this.alertService.clearAlert();
    //     this.alertService.setAlert(
    //       'danger',
    //       globalConst.deActivateTeamMemberError
    //     );
    //   }
    // );
  }

  /**
   * Navigates to add team member page
   */
  addSupplier(): void {
    this.router.navigate([
      '/responder-access/supplier-management/add-supplier'
    ]);
  }
}
