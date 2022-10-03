import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MemberRole, TeamMember } from 'src/app/core/api/models';
import {
  ActionPermission,
  ClaimType
} from 'src/app/core/services/authorization.service';
import { UserService } from 'src/app/core/services/user.service';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/components/dialog-components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { TeamListDataService } from '../team-list/team-list-data.service';
import { TeamMemberDetailsService } from './team-member-details.service';
import * as globalConst from '../../../core/services/global-constants';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { TeamMemberModel } from '../../../core/models/team-member.model';

@Component({
  selector: 'app-team-member-detail',
  templateUrl: './team-member-detail.component.html',
  styleUrls: ['./team-member-detail.component.scss']
})
export class TeamMemberDetailComponent {
  teamMember: TeamMemberModel;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private teamDetailsService: TeamMemberDetailsService,
    private teamDataService: TeamListDataService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras
          .state as TeamMemberModel;
        this.teamMember = state;
      }
    } else {
      this.teamMember =
        this.teamDataService.getSelectedTeamMember() as TeamMemberModel;
    }
  }

  /**
   * Opens the delete confirmation modal, deletes the team member and
   * navigates to team member list
   */
  deleteUser(): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: DeleteConfirmationDialogComponent
        },
        width: '650px'
      })
      .afterClosed()
      .subscribe({
        next: (event) => {
          if (event === 'delete') {
            this.teamDetailsService
              .deleteTeamMember(this.teamMember.id)
              .subscribe({
                next: (value) => {
                  const stateIndicator = { action: 'delete' };
                  this.router.navigate(
                    [
                      '/responder-access/responder-management/details/member-list'
                    ],
                    { state: stateIndicator }
                  );
                },
                error: (error) => {
                  this.alertService.clearAlert();
                  this.alertService.setAlert(
                    'danger',
                    globalConst.teamMemberDeleteError
                  );
                }
              });
          }
        }
      });
  }

  /**
   * Checks if the user can permission to perform given action
   *
   * @param action user action
   * @returns true/false
   */
  public hasPermission(action: string): boolean {
    return this.userService.hasClaim(
      ClaimType.action,
      ActionPermission[action]
    );
  }

  /**
   * Navigates to edit team member component
   */
  editUser(): void {
    this.router.navigate(
      ['/responder-access/responder-management/details/edit'],
      { state: this.teamMember }
    );
  }

  /**
   * Navigates to team members list
   */
  cancel(): void {
    this.router.navigate([
      '/responder-access/responder-management/details/member-list'
    ]);
  }

  /**
   * Role based access to edit button
   *
   * @param row selected team member
   * @returns true/false
   */
  isEditAllowed(row: TeamMember): boolean {
    const loggedInRole = this.userService?.currentProfile?.role;
    if (loggedInRole === MemberRole.Tier2) {
      return row.role === MemberRole.Tier1 ? true : false;
    } else if (loggedInRole === MemberRole.Tier3) {
      return row.role === MemberRole.Tier1 || row.role === MemberRole.Tier2
        ? true
        : false;
    } else if (loggedInRole === MemberRole.Tier4) {
      return row.role === MemberRole.Tier1 ||
        row.role === MemberRole.Tier2 ||
        row.role === MemberRole.Tier3
        ? true
        : false;
    }
  }
}
