import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { SupplierListDataService } from '../suppliers-list/supplier-list-data.service';
import { MemberRole, MutualAid, Team } from 'src/app/core/api/models';
import * as globalConst from '../../../core/services/global-constants';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { SupplierModel } from 'src/app/core/models/supplier.model';
import { EditSupplierService } from '../edit-supplier/edit-supplier.service';
import { MatTableDataSource } from '@angular/material/table';
import { SupplierDetailService } from './supplier-detail.service';
import {
  Community,
  LocationsService
} from 'src/app/core/services/locations.service';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';
import { SupplierService } from 'src/app/core/services/suppliers.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';

@Component({
  selector: 'app-supplier-detail',
  templateUrl: './supplier-detail.component.html',
  styleUrls: ['./supplier-detail.component.scss']
})
export class SupplierDetailComponent implements OnInit {
  searchMutualAidForm: UntypedFormGroup;
  selectedSupplier: SupplierModel;
  detailsType: string;
  loggedInRole: string;

  mutualAidDisplayedColumns: string[] = ['essTeam', 'dateAdded', 'action'];
  mutualAidDataSource = new MatTableDataSource();
  showLoader = false;
  searchESSTeamLoader = false;
  addESSTeamLoader = false;
  blueColor = '#234075';
  city: Community[] = [];
  communityFilteredOptions: Observable<Community[]>;
  essTeam: Team[] = [];
  essTeamFilteredOptions: Observable<Team[]>;
  essTeamsListResult: Team[];
  noneResults = false;

  constructor(
    private builder: UntypedFormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private supplierListDataService: SupplierListDataService,
    private userService: UserService,
    private editSupplierService: EditSupplierService,
    private supplierDetailService: SupplierDetailService,
    private locationService: LocationsService,
    private supplierService: SupplierService,
    private alertService: AlertService
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras !== undefined) {
        const params = this.router.getCurrentNavigation().extras.queryParams;
        if (params) {
          this.detailsType = params.type;
        }
      }
      this.selectedSupplier =
        this.supplierListDataService.getSelectedSupplier();
    }
  }

  ngOnInit(): void {
    // if selectedSupplier is not defined, go back to the main suppliers list page
    if (this.selectedSupplier === undefined) {
      this.router.navigate([
        '/responder-access/supplier-management/suppliers-list'
      ]);
    }

    // sets the current user's role to check access
    this.loggedInRole = this.userService?.currentProfile?.role;

    // Creates the mutual aid search form
    this.createSearchMutualAidForm();

    // In case the selected supplier has associated mutual Aid Teams, the corresponding table is filled up with this information.
    this.mutualAidDataSource = new MatTableDataSource(
      this.selectedSupplier?.mutualAids
    );

    // Gets the community List for mutual Aid Search by Community field
    this.city = this.locationService.getActiveCommunityList();

    // Filters options as the user inserts characters on the Community field
    this.communityFilteredOptions = this.searchMutualAidForm
      .get('community')
      .valueChanges.pipe(
        startWith(''),
        map((value) => (value ? this.filterComm(value) : this.city.slice()))
      );

    // Gets the Ess Team names of all existing teams
    this.essTeam = this.supplierListDataService.getNonMutualAidTeams();

    this.essTeamFilteredOptions = this.searchMutualAidForm
      .get('essTeam')
      .valueChanges.pipe(
        startWith(''),
        map((value) =>
          value ? this.filterEssTeam(value) : this.essTeam.slice()
        )
      );
  }

  /**
   * Returns the control of the form
   */
  get searchMutualAidFormControl(): { [key: string]: AbstractControl } {
    return this.searchMutualAidForm.controls;
  }

  /**
   * Returns the display value of autocomplete
   *
   * @param city : Selected city object
   */
  cityDisplayFn(city: Community): string {
    if (city) {
      return city.name;
    }
  }

  /**
   * Returns the display value of autocomplete
   *
   * @param essTeam : Selected ESS Team object
   */
  essTeamDisplayFn(essTeam: Team): string {
    if (essTeam) {
      return essTeam.name;
    }
  }

  /**
   * Opens the delete confirmation modal, deletes the team member and
   * navigates to team member list
   */
  deleteSupplier(): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: InformationDialogComponent,
          content: globalConst.deleteSupplierFromList
        },
        width: '650px'
      })
      .afterClosed()
      .subscribe({
        next: (event) => {
          if (event === 'confirm') {
            this.supplierService
              .deleteSupplier(this.selectedSupplier.id)
              .subscribe({
                next: (value) => {
                  const stateIndicator = { action: 'delete' };
                  this.router.navigate(
                    ['/responder-access/supplier-management/suppliers-list'],
                    { state: stateIndicator }
                  );
                },
                error: (error) => {
                  this.alertService.clearAlert();
                  this.alertService.setAlert(
                    'danger',
                    globalConst.deleteSupplierError
                  );
                }
              });
          }
        }
      });
  }

  /**
   * Navigates to edit team member component
   */
  editSupplier(): void {
    if (this.selectedSupplier.primaryTeams.length > 1) {
      this.editNotAllowedDialog();
    } else {
      this.editSupplierService.editedSupplier = this.selectedSupplier;
      this.router.navigate([
        '/responder-access/supplier-management/edit-supplier'
      ]);
    }
  }

  editNotAllowedDialog() {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: globalConst.editExistingSupplierMessage
      },
      width: '600px'
    });
  }

  /**
   * According to the user's accesss, displays the mutual Aid section
   *
   * @returns true or false to show the mutual aid section.
   */
  showMutualAid(): boolean {
    if (
      this.loggedInRole === MemberRole.Tier4 ||
      this.loggedInRole === MemberRole.Tier3
    ) {
      if (this.detailsType === 'supplier') {
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * Search ESS Teams belonging to the inserted Community Code
   *
   * @param community the selected community object
   */
  searchEssTeamByComm(community: Community): void {
    this.essTeamsListResult = [];
    this.noneResults = false;
    this.searchESSTeamLoader = !this.searchESSTeamLoader;
    this.supplierService.getMutualAidByCommunity(community.code).subscribe({
      next: (results) => {
        this.essTeamsListResult =
          this.supplierListDataService.filterEssTeams(results);
        if (this.essTeamsListResult.length === 0) {
          this.noneResults = true;
        }
        this.searchESSTeamLoader = !this.searchESSTeamLoader;
      },
      error: (error) => {
        this.alertService.clearAlert();
        this.searchESSTeamLoader = !this.searchESSTeamLoader;
        this.alertService.setAlert('danger', globalConst.genericError);
      }
    });
  }

  /**
   * Search ESS Teams by name
   *
   * @param essTeam the selected ESS Team object
   */
  searchEssTeamByName(essTeam: Team): void {
    this.essTeamsListResult = [];
    this.noneResults = false;
    this.essTeamsListResult.push(essTeam);
  }

  /**
   * Adds the selected supplier as a mutual Aid for the ESS Team that was selected
   */
  addMutualAidEssTeam(): void {
    this.addESSTeamLoader = !this.addESSTeamLoader;
    const team = this.searchMutualAidForm.get('selectedEssTeam').value;
    this.supplierDetailService.addMutualAid(this.selectedSupplier.id, team.id);
  }

  /**
   * Rescinds the selected Supplier for the selected ESS Team
   *
   * @param mutualAid The MutalAid which team relationship will be rescind
   */
  rescindSupplier(mutialAid: MutualAid): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: InformationDialogComponent,
          content: globalConst.rescindSupplierFromList
        },
        width: '600px'
      })
      .afterClosed()
      .subscribe({
        next: (event) => {
          if (event === 'confirm') {
            this.showLoader = !this.showLoader;
            this.supplierDetailService.rescindMutualAid(
              this.selectedSupplier.id,
              mutialAid.givenToTeam.id
            );
          }
        }
      });
  }

  /**
   * Builds the form to search for Mutual Aid Suppliers
   */
  private createSearchMutualAidForm(): void {
    this.searchMutualAidForm = this.builder.group({
      essTeam: [''],
      community: [''],
      selectedEssTeam: ['', Validators.required]
    });
  }

  /**
   * Filters the city list for autocomplete field
   *
   * @param value : User typed value
   */
  private filterComm(value?: string): Community[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.city.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
  }

  /**
   * Filters the city list for autocomplete field
   *
   * @param value : User typed value
   */
  private filterEssTeam(value?: string): Team[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.essTeam.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
  }
}
