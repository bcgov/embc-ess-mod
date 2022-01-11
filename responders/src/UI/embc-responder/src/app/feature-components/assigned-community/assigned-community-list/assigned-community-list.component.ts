import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { TeamCommunityModel } from 'src/app/core/models/team-community.model';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { AssignedCommunityListDataService } from './assigned-community-list-data.service';
import { AssignedCommunityListService } from './assigned-community-list.service';
import * as globalConst from '../../../core/services/global-constants';
import { Community } from 'src/app/core/services/locations.service';
import { AddCommunityService } from '../add-community/add-community.service';

@Component({
  selector: 'app-assigned-community-list',
  templateUrl: './assigned-community-list.component.html',
  styleUrls: ['./assigned-community-list.component.scss']
})
export class AssignedCommunityListComponent implements OnInit {
  filterTerm: TableFilterValueModel;
  filtersToLoad: TableFilterModel;
  assignedCommunities: TeamCommunityModel[];
  displayedColumns: TableColumnModel[];
  filterPredicate: (data: TeamCommunityModel, filter: string) => boolean;
  communitiesToDeleteList: Community[] = [];
  isLoading = false;

  constructor(
    private assignedCommunityListService: AssignedCommunityListService,
    private alertService: AlertService,
    private assignedCommunityListDataService: AssignedCommunityListDataService,
    private router: Router,
    private addCommunityService: AddCommunityService
  ) {}

  /**
   * On component init, loads the assigned community list and filters
   */
  ngOnInit(): void {
    this.assignedCommunityListDataService.clear();
    this.addCommunityService.clear();
    this.communitiesFilterPredicate();
    this.assignedCommunityListService.getAssignedCommunityList().subscribe({
      next: (values) => {
        this.isLoading = !this.isLoading;
        this.assignedCommunities = values;
        this.assignedCommunityListDataService.setTeamCommunityList(values);
      },
      error: (error) => {
        this.isLoading = !this.isLoading;
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.communityListError);
      }
    });

    this.filtersToLoad = this.assignedCommunityListDataService.filtersToLoad;
    this.displayedColumns =
      this.assignedCommunityListDataService.displayedColumns;
  }

  /**
   * Sets the user selected filers
   *
   * @param event user selected filters
   */
  filter(event: TableFilterValueModel): void {
    this.filterTerm = event;
  }

  /**
   * Navigates to add communities component
   */
  addCommunities(): void {
    this.router.navigate([
      '/responder-access/community-management/add-communities'
    ]);
  }

  /**
   * Custom filter predicate for assigned community list
   */
  communitiesFilterPredicate(): void {
    const filterPredicate = (
      data: TeamCommunityModel,
      filter: string
    ): boolean => {
      const searchString: TableFilterValueModel = JSON.parse(filter);
      if (searchString.type === 'text') {
        return (
          data.name
            .trim()
            .toLowerCase()
            .indexOf(searchString.value.trim().toLowerCase()) !== -1
        );
      } else if (searchString.type === 'array') {
        const terms = searchString.value.split(',');
        const districtTerm = terms[0];
        const typeTerm = terms[1];
        const matchFilter = [];
        const districtBoolean =
          data.districtName
            .trim()
            .toLowerCase()
            .indexOf(districtTerm.trim().toLowerCase()) !== -1;
        const typeBoolean =
          data.type
            .trim()
            .toLowerCase()
            .indexOf(typeTerm.trim().toLowerCase()) !== -1;
        matchFilter.push(districtBoolean);
        matchFilter.push(typeBoolean);
        return matchFilter.every(Boolean);
      }
    };
    this.filterPredicate = filterPredicate;
  }

  /**
   * Sets the list of assigned communities to delete
   *
   * @param $event list of communities to remove
   */
  communitiesToDelete($event): void {
    this.communitiesToDeleteList = $event;
    this.assignedCommunityListDataService.setCommunitiesToDelete($event);
  }

  /**
   * Navigates to review page for community removal
   */
  deleteCommunities(): void {
    this.router.navigate(['/responder-access/community-management/review'], {
      queryParams: { action: 'delete' }
    });
  }
}
