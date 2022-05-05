import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamCommunityModel } from 'src/app/core/models/team-community.model';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { AddCommunityService } from '../add-community/add-community.service';
import { AssignedCommunityListDataService } from '../assigned-community-list/assigned-community-list-data.service';
import { AssignedCommunityReviewService } from './assigned-community-review.service';
import * as globalConst from '../../../core/services/global-constants';
import { UserService } from '../../../core/services/user.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private addCommunityService: AddCommunityService,
    private assignedCommunityDataService: AssignedCommunityListDataService,
    private assignedCommunityReviewService: AssignedCommunityReviewService,
    private alertService: AlertService,
    private userService: UserService
  ) {}

  public get teamName(): string {
    return this.userService.currentProfile?.teamName;
  }

  /**
   * Loads the added/removed community lists
   */
  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    if (params) {
      this.reviewAction = params.action;
    }
    this.addedCommunityList = this.addCommunityService.getAddedCommunities();
    this.deleteCommunityList =
      this.assignedCommunityDataService.getCommunitiesToDelete();
  }

  /**
   * Navigates to add communities component
   */
  goBack(): void {
    this.router.navigate([
      '/responder-access/community-management/add-communities'
    ]);
  }

  /**
   * Adds the selected communities to assigned community list
   */
  save(): void {
    this.showLoader = !this.showLoader;
    this.isSubmitted = !this.isSubmitted;
    this.assignedCommunityReviewService
      .addCommunities(this.addedCommunityList.map((comm) => comm.code))
      .subscribe({
        next: (response) => {
          this.router.navigate([
            '/responder-access/community-management/list-communities'
          ]);
        },
        error: (error) => {
          this.showLoader = !this.showLoader;
          this.isSubmitted = !this.isSubmitted;
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.saveCommunityListError
          );
        }
      });
  }

  /**
   * Navigates to cummity list page
   */
  cancel(): void {
    this.router.navigate([
      '/responder-access/community-management/list-communities'
    ]);
  }

  /**
   * Removes the selected communities from the assigned
   * community list
   */
  remove(): void {
    this.showLoader = !this.showLoader;
    this.isSubmitted = !this.isSubmitted;
    this.assignedCommunityReviewService
      .removeCommunities(
        this.deleteCommunityList.map((comm) => comm.communityCode)
      )
      .subscribe({
        next: (response) => {
          this.router.navigate([
            '/responder-access/community-management/list-communities'
          ]);
        },
        error: (error) => {
          this.showLoader = !this.showLoader;
          this.isSubmitted = !this.isSubmitted;
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.removeCommunityListError
          );
        }
      });
  }
}
