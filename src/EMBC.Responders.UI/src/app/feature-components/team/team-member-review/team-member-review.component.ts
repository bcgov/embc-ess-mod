import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TeamMember } from 'src/app/core/api/models';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { TeamListDataService } from '../team-list/team-list-data.service';
import { TeamMemberReviewService } from './team-member-review.service';
import * as globalConst from '../../../core/services/global-constants';

@Component({
  selector: 'app-team-member-review',
  templateUrl: './team-member-review.component.html',
  styleUrls: ['./team-member-review.component.scss']
})
export class TeamMemberReviewComponent {
  teamMember: TeamMember;
  showLoader = false;
  isSubmitted = false;

  constructor(
    private router: Router,
    private teamDataService: TeamListDataService,
    private teamMemberReviewService: TeamMemberReviewService,
    private alertService: AlertService
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras
          .state as TeamMember;
        this.teamMember = state;
      }
    } else {
      this.teamMember = this.teamDataService.getSelectedTeamMember();
    }
  }

  /**
   * Navigates to edit page if team member id exists, else
   * navigates to the add member page
   *
   */
  goBack(): void {
    if (this.teamMember.id) {
      this.router.navigate(
        ['/responder-access/responder-management/details/edit'],
        { state: this.teamMember }
      );
    } else {
      this.router.navigate([
        '/responder-access/responder-management/add-member'
      ]);
    }
  }

  /**
   * Save the changes
   */
  save(): void {
    this.showLoader = !this.showLoader;
    this.isSubmitted = !this.isSubmitted;
    if (this.teamMember.id) {
      this.updateTeamMember();
    } else {
      this.addTeamMember();
    }
  }

  /**
   * Updates the team member and navigates to team list
   */
  updateTeamMember(): void {
    this.teamMemberReviewService
      .updateTeamMember(this.teamMember.id, this.teamMember)
      .subscribe({
        next: (value) => {
          const stateIndicator = { action: 'edit' };
          this.router.navigate(
            ['/responder-access/responder-management/details/member-list'],
            { state: stateIndicator }
          );
        },
        error: (error) => {
          this.showLoader = !this.showLoader;
          this.isSubmitted = !this.isSubmitted;
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.updateTeamMemberError
          );
        }
      });
  }

  /**
   * Adds the team member and navigates to team list
   */
  addTeamMember(): void {
    this.teamMemberReviewService.addTeamMember(this.teamMember).subscribe({
      next: (value) => {
        const stateIndicator = { action: 'add' };
        this.router.navigate(
          ['/responder-access/responder-management/details/member-list'],
          { state: stateIndicator }
        );
      },
      error: (error) => {
        this.showLoader = !this.showLoader;
        this.isSubmitted = !this.isSubmitted;
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.saveTeamMemberError);
      }
    });
  }
}
