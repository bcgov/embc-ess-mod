import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
      address: {
        addressLine1: '120 Main Street',
        addressLine2: 'Office 123',
        postalCode: 'V6Z 0G7',
        stateProvince: {
          code: 'BC',
          countryCode: 'CA',
          name: 'British Columbia'
        },
        community: 'Victoria',
        country: { code: 'CA', name: 'Canada' }
      },
      isMutualAid: true,
      isActive: true,
      gstNumber: '222222222-RT-2222',
      primaryContact: {
        firstName: 'John',
        lastName: 'Smith',
        phoneNumber: '250 678 5789',
        email: 'john@sleepeasyhotel.ca'
      }
    },
    {
      legalName: 'Master Foods',
      name: 'FRESH FOODS',
      address: {
        addressLine1: '120 Main Street',
        addressLine2: 'Office 123',
        postalCode: 'V6Z 0G7',
        stateProvince: {
          code: 'BC',
          countryCode: 'CA',
          name: 'British Columbia'
        },
        community: 'Victoria',
        country: { code: 'CA', name: 'Canada' }
      },
      isMutualAid: false,
      isActive: true,
      gstNumber: '999999999-RT-9999',
      primaryContact: {
        firstName: 'William',
        lastName: 'Terrace',
        phoneNumber: '250 678 5789',
        email: 'william@freshfoods.ca'
      }
    },
    {
      legalName: 'Hotels Inc.',
      name: 'SLEEP EASY HOTEL',
      address: {
        addressLine1: '120 Main Street',
        addressLine2: 'Office 123',
        postalCode: 'V6Z 0G7',
        stateProvince: {
          code: 'BC',
          countryCode: 'CA',
          name: 'British Columbia'
        },
        community: 'Victoria',
        country: { code: 'CA', name: 'Canada' }
      },
      isMutualAid: false,
      isActive: false,
      gstNumber: '333333333-RT-3333',
      primaryContact: {
        firstName: 'Rosalyn',
        lastName: 'Smith',
        phoneNumber: '250 678 5789',
        email: 'rsmith@hotelsinc.ca'
      }
    },
    {
      legalName: 'Victoria Cabs',
      name: 'VICTORIA CABS',
      address: {
        addressLine1: '120 Main Street',
        addressLine2: 'Office 123',
        postalCode: 'V6Z 0G7',
        stateProvince: {
          code: 'BC',
          countryCode: 'CA',
          name: 'British Columbia'
        },
        community: 'Victoria',
        country: { code: 'CA', name: 'Canada' }
      },
      isMutualAid: false,
      isActive: false,
      gstNumber: '555555555-RT-9999',
      primaryContact: {
        firstName: 'Anne',
        lastName: 'Boots',
        phoneNumber: '250 678 5789',
        email: 'aboots@victoriacabs.ca'
      }
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
    private route: ActivatedRoute,
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
    this.listSupplierDataService.selectedSupplier = $event;
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
