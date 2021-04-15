import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TeamMember } from 'src/app/core/api/models';
import { ActionPermission, ClaimType, ModulePermission } from 'src/app/core/services/authorization.service';
import { UserService } from 'src/app/core/services/user.service';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/components/dialog-components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { TeamListDataService } from '../team-list/team-list-data.service';
import { TeamMemberDetailsService } from './team-member-details.service';

@Component({
  selector: 'app-team-member-detail',
  templateUrl: './team-member-detail.component.html',
  styleUrls: ['./team-member-detail.component.scss']
})
export class TeamMemberDetailComponent implements OnInit {

  teamMember: TeamMember;

  constructor(private router: Router, private dialog: MatDialog, private teamDetailsService: TeamMemberDetailsService,
    private teamDataService: TeamListDataService, private userService: UserService) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state as TeamMember;
        this.teamMember = state;
      }
    } else {
      this.teamMember = this.teamDataService.getSelectedTeamMember();
    }
  }

  ngOnInit(): void {
  }

  deleteUser(): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: DeleteConfirmationDialogComponent
      },
      height: '300px',
      width: '650px'
    }).afterClosed().subscribe(event => {
      if (event === 'delete') {
        this.teamDetailsService.deleteTeamMember(this.teamMember.id).subscribe(value => {
          const stateIndicator = { action: 'delete' };
          this.router.navigate(['/responder-access/responder-management/details/member-list'], { state: stateIndicator });
        });
      }
    });
  }

  public hasPermission(action: string): boolean {
    return this.userService.hasClaim(ClaimType.action, ActionPermission[action]);
  }

  editUser(): void {
    this.router.navigate(['/responder-access/responder-management/details/edit'], { state: this.teamMember });
  }

  cancel(): void {
    this.router.navigate(['/responder-access/responder-management/details/member-list']);
  }

  isEditAllowed(row: TeamMember): boolean {
    let loggedInRole = this.userService.currentProfile.role;
    if(loggedInRole === 'Tier2'){
      if(row.role === 'Tier1') {
        return true;
      } else {
        return false
      }
    } else if(loggedInRole === 'Tier3') {
      if(row.role === 'Tier1' || row.role === 'Tier2') {
        return true;
      } else {
        return false
      }
    } else if(loggedInRole === 'Tier4') {
      if(row.role === 'Tier1' || row.role === 'Tier2' || row.role === 'Tier3') {
        return true;
      } else {
        return false
      }
    }
  }

}
