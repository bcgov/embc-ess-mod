import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TeamMember } from 'src/app/core/api/models';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { TeamListDataService } from './team-list-data.service';
import { TeamListService } from './team-list.service';
import * as globalConst from '../../../core/services/global-constants';
import { UserService } from 'src/app/core/services/user.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements OnInit {

  filterTerm: TableFilterValueModel;
  filtersToLoad: TableFilterModel;
  displayedColumns: TableColumnModel[];
  teamMembers: TeamMember[];
  isLoading = false;
  statusLoading = true;
  loggedInRole: string;

  constructor(private teamListService: TeamListService, private router: Router, private teamDataService: TeamListDataService,
    private dialog: MatDialog, private userService: UserService, private alertService: AlertService) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state;
        this.enableActionNotification(state);
      }
    }
  }

  /**
   * On component init, loads the team member list and filters
   */
  ngOnInit(): void {
    this.teamDataService.clear();
    this.teamListService.getTeamMembers().subscribe(values => {
      this.isLoading = !this.isLoading;
      this.teamMembers = values;
    },
      (error) => {
        this.isLoading = !this.isLoading;
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.teamMemberListError);
      });
    this.filtersToLoad = this.teamDataService.filtersToLoad;
    this.displayedColumns = this.teamDataService.displayedColumns;
    this.loggedInRole = this.userService.currentProfile.role;
  }

  /**
   * Sets the user selected filers
   * @param event user selected filters
   */
  filter(event: TableFilterValueModel): void {
    this.filterTerm = event;
  }

  /**
   * Sets the selected team member to the services and navigates to the details page
   * @param $event Selected team member object
   */
  openMemberDetails($event: TeamMember): void {
    this.teamDataService.setSelectedTeamMember($event);
    this.router.navigate(['/responder-access/responder-management/details/member-details'], { state: $event });
  }

  /**
   * Activates an inactive user
   * @param $event team member id
   */
  activateTeamMember($event: string): void {
    this.statusLoading = !this.statusLoading;
    this.teamListService.activateTeamMember($event).subscribe(value => {
      this.statusLoading = !this.statusLoading;
      this.teamMembers = value;
    }, (error) => {
      this.statusLoading = !this.statusLoading;
      this.alertService.clearAlert();
      this.alertService.setAlert('danger', globalConst.activateTeamMemberError);
    });
  }

  /**
   * Inactivate an active user
   * @param $event team member id
   */
  deactivateTeamMember($event: string): void {
    this.statusLoading = !this.statusLoading;
    this.teamListService.deactivatedTeamMember($event).subscribe(value => {
      this.statusLoading = !this.statusLoading;
      this.teamMembers = value;
    }, (error) => {
      this.statusLoading = !this.statusLoading;
      this.alertService.clearAlert();
      this.alertService.setAlert('danger', globalConst.deActivateTeamMemberError);
    });
  }

  /**
   * Navigates to add team member page
   */
  addTeamMember(): void {
    this.router.navigate(['/responder-access/responder-management/add-member']);
  }

  /**
   * Populates action basec notification and open confirmation box
   * @param state navigation state string
   */
  enableActionNotification(state: { [k: string]: any; }): void {
    let displayText = '';
    if (state?.action === 'delete') {
      displayText = globalConst.deleteMessage;
    } else if (state?.action === 'edit') {
      displayText = globalConst.editMessage;
    } else {
      displayText = globalConst.addMessage;
    }
    setTimeout(() => {
      this.openConfirmation(displayText);
    }, 500);
  }

  /**
   * Open confirmation modal window
   * @param text text to display
   */
  openConfirmation(text: string): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        text
      },
      height: '230px',
      width: '530px'
    });
  }
}


