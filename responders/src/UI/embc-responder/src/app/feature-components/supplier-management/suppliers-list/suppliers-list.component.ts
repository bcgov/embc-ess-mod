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
import { SupplierTemp } from './supplier-list-data.service';
import * as globalConst from '../../../core/services/global-constants';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.scss']
})
export class SuppliersListComponent implements OnInit {
  suppliersListData: SupplierTemp[] = [
    {
      id: '0001',
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
      gstNumber: { part1: '222222222', part2: '2222' },
      primaryContact: {
        firstName: 'John',
        lastName: 'Smith',
        phoneNumber: '250 678 5789',
        email: 'john@sleepeasyhotel.ca'
      }
    },
    {
      id: '0002',
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
      gstNumber: { part1: '999999999', part2: '9999' },
      primaryContact: {
        firstName: 'William',
        lastName: 'Terrace',
        phoneNumber: '250 678 5789',
        email: 'william@freshfoods.ca'
      }
    },
    {
      id: '0003',
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
      gstNumber: { part1: '333333333', part2: '3333' },
      primaryContact: {
        firstName: 'Rosalyn',
        lastName: 'Smith',
        phoneNumber: '250 678 5789',
        email: 'rsmith@hotelsinc.ca'
      }
    },
    {
      id: '0004',
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
      gstNumber: { part1: '555555555', part2: '9999' },
      primaryContact: {
        firstName: 'Anne',
        lastName: 'Boots',
        phoneNumber: '250 678 5789',
        email: 'aboots@victoriacabs.ca'
      }
    }
  ];

  mutualAidListData: SupplierTemp[] = [
    {
      id: '0001',
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
      gstNumber: { part1: '222222222', part2: '2222' },
      primaryContact: {
        firstName: 'John',
        lastName: 'Smith',
        phoneNumber: '250 678 5789',
        email: 'john@sleepeasyhotel.ca'
      }
    },
    {
      id: '0002',
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
      gstNumber: { part1: '999999999', part2: '9999' },
      primaryContact: {
        firstName: 'William',
        lastName: 'Terrace',
        phoneNumber: '250 678 5789',
        email: 'william@freshfoods.ca'
      }
    }
  ];

  primarySupplierFilterTerm: TableFilterValueModel;
  mutualAidSupplierFilterTerm: TableFilterValueModel;
  filtersToLoad: TableFilterModel;
  primarySuppliersColumns: TableColumnModel[];
  mutualAidSuppliersColumns: TableColumnModel[];
  suppliersList: SupplierTemp[];
  mutualAidList: SupplierTemp[];
  isLoading = false;
  statusLoading = true;
  loggedInRole: string;

  constructor(
    private listSupplierDataService: SupplierListDataService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog
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

    setTimeout(() => {
      this.suppliersList = this.suppliersListData;
      this.mutualAidList = this.mutualAidListData;
      this.isLoading = !this.isLoading;
    }, 5000);

    // this.teamListService.getTeamMembers().subscribe(
    //   (values) => {
    //     this.isLoading = !this.isLoading;
    //     this.teamMembers = values;
    //   },
    //   (error) => {
    //     this.isLoading = !this.isLoading;
    //     this.alertService.clearAlert();
    //     this.alertService.setAlert('danger', globalConst.teamMemberListError);
    //   }
    // );
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
  openSupplierDetails($event: SupplierTemp): void {
    this.listSupplierDataService.setSelectedSupplier($event);
    this.router.navigate(
      ['/responder-access/supplier-management/supplier-detail'],
      { state: { ...$event }, queryParams: { type: 'supplier' } }
    );
  }

  openMutualAidDetails($event: SupplierTemp): void {
    this.listSupplierDataService.setSelectedSupplier($event);
    this.router.navigate(
      ['/responder-access/supplier-management/supplier-detail'],
      { state: { ...$event }, queryParams: { type: 'mutualAid' } }
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
