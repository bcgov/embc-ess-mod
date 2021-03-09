import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamCommunityModel } from 'src/app/core/models/team-community.model';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { AddCommunityService } from '../add-community/add-community.service';
import { AssignedCommunityListDataService } from '../assigned-community-list/assigned-community-list-data.service';
import { AssignedCommunityReviewService } from './assigned-community-review.service';

@Component({
  selector: 'app-assigned-community-review',
  templateUrl: './assigned-community-review.component.html',
  styleUrls: ['./assigned-community-review.component.scss']
})
export class AssignedCommunityReviewComponent implements OnInit {

  reviewAction: string;
  addedCommunityList: TeamCommunityModel[];
  deleteCommunityList: TeamCommunityModel[];
  showLoader = false;
  isSubmitted = false;

  constructor(private route: ActivatedRoute, private router: Router, private addCommunityService: AddCommunityService,
              private assignedCommunityDataService: AssignedCommunityListDataService,
              private assignedCommunityReviewService: AssignedCommunityReviewService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    if (params) {
      this.reviewAction = params.action;
    }
    this.addedCommunityList = this.addCommunityService.getAddedCommunities();
    this.deleteCommunityList = this.assignedCommunityDataService.getCommunitiesToDelete();
  }

  goBack(): void {
    this.router.navigate(['/responder-access/community-management/add-communities']);
  }

  save(): void {
    this.showLoader = !this.showLoader;
    this.isSubmitted = !this.isSubmitted;
    this.assignedCommunityReviewService.addCommunities(this.addedCommunityList.map(comm => comm.communityId)).subscribe(response => {
      this.router.navigate(['/responder-access/community-management/list-communities']);
    }, (error) => {
      this.showLoader = !this.showLoader;
      this.isSubmitted = !this.isSubmitted;
      this.alertService.setAlert('danger', error.error.title);
    });
  }

  cancel(): void {
    this.router.navigate(['/responder-access/community-management/list-communities']);
  }

  remove(): void {
    this.showLoader = !this.showLoader;
    this.isSubmitted = !this.isSubmitted;
    this.assignedCommunityReviewService.removeCommunities(this.deleteCommunityList.map(comm => comm.communityId)).subscribe(response => {
      this.router.navigate(['/responder-access/community-management/list-communities']);
    }, (error) => {
      this.showLoader = !this.showLoader;
      this.isSubmitted = !this.isSubmitted;
      this.alertService.setAlert('danger', error.error.title);
    });
  }

}
