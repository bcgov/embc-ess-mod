import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamCommunityModel } from 'src/app/core/models/team-community.model';
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
  communityList: TeamCommunityModel[];
  deleteCommunityList: TeamCommunityModel[];

  constructor(private route: ActivatedRoute, private router: Router, private addCommunityService: AddCommunityService,
    private assignedCommunityDataService: AssignedCommunityListDataService, private assignedCommunityReviewService: AssignedCommunityReviewService) {
  }

  ngOnInit(): void {
    let params = this.route.snapshot.queryParams;
    if(params) {
      this.reviewAction = params.action;
    }
    this.communityList = this.addCommunityService.getAddedCommunities();
    this.deleteCommunityList = this.assignedCommunityDataService.getCommunitiesToDelete();
  }

  goBack(): void {
    this.router.navigate(['/responder-access/community-management/add-communities'])
  }

  save(): void {
    this.assignedCommunityReviewService.addCommunities(this.communityList.map(comm => {return comm['communityId']}));
  }

  cancel(): void {
    this.router.navigate(['/responder-access/community-management/list-communities'])
  }

  remove(): void {
    this.assignedCommunityReviewService.removeCommunities(this.deleteCommunityList.map(comm => {return comm['communityId']}));
  }

}
