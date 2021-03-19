import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeamMember } from 'src/app/core/api/models';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { TeamListDataService } from '../team-list/team-list-data.service';
import { TeamMemberReviewService } from './team-member-review.service';

@Component({
  selector: 'app-team-member-review',
  templateUrl: './team-member-review.component.html',
  styleUrls: ['./team-member-review.component.scss']
})
export class TeamMemberReviewComponent implements OnInit {

  teamMember: TeamMember;
  showLoader = false;
  isSubmitted = false;

  constructor(private router: Router, private teamDataService: TeamListDataService,
    private teamMemberReviewService: TeamMemberReviewService, private alertService: AlertService) {
    if (this.router.getCurrentNavigation().extras.state !== undefined) {
      const state = this.router.getCurrentNavigation().extras.state as TeamMember;
      console.log(state);
      this.teamMember = state;
    } else {
      this.teamMember = this.teamDataService.getSelectedTeamMember();
    }
  }

  ngOnInit(): void {
  }

  goBack(): void {
    this.router.navigate(['/responder-access/responder-management/details/edit'], { state: this.teamMember });
  }

  save(): void {
    this.showLoader = !this.showLoader;
    this.isSubmitted = !this.isSubmitted;
    if (this.teamMember.id) {
      this.updateTeamMember()
    } else {
      this.addTeamMember();
    }
  }

  updateTeamMember(): void {
    this.teamMemberReviewService.updateTeamMember(this.teamMember.id, this.teamMember).subscribe(value => {
      this.router.navigate(['/responder-access/responder-management/details/member-list']);
    }, (error) => {
      this.showLoader = !this.showLoader;
      this.isSubmitted = !this.isSubmitted;
      if (error.title) {
        this.alertService.setAlert('danger', error.title);
      } else {
        this.alertService.setAlert('danger', error.statusText);
      }
    })
  }

  addTeamMember(): void {
    this.teamMemberReviewService.addTeamMember(this.teamMember).subscribe(value => {
      this.router.navigate(['/responder-access/responder-management/details/member-list']);
    }, (error) => {
      this.showLoader = !this.showLoader;
      this.isSubmitted = !this.isSubmitted;
      if (error.title) {
        this.alertService.setAlert('danger', error.title);
      } else {
        this.alertService.setAlert('danger', error.statusText);
      }
    })
  }

}
