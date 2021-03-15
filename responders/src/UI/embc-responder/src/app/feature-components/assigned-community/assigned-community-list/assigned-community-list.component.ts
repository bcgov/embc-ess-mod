import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Community } from 'src/app/core/api/models';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { TeamCommunityModel } from 'src/app/core/models/team-community.model';
import { AssignedCommunityListDataService } from './assigned-community-list-data.service';
import { AssignedCommunityListService } from './assigned-community-list.service';

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

  constructor(private assignedCommunityListService: AssignedCommunityListService,
              private assignedCommunityListDataService: AssignedCommunityListDataService, private router: Router) { }

  ngOnInit(): void {
    this.communitiesFilterPredicate();
    this.assignedCommunityListService.getAssignedCommunityList().subscribe(values => {
      this.assignedCommunities = values;
      this.assignedCommunityListDataService.setTeamCommunityList(values);
    });

    this.assignedCommunityListService.getAllAssignedCommunityList().subscribe(values => {
      this.assignedCommunityListDataService.setAllTeamCommunityList(values);
    });

    this.filtersToLoad = this.assignedCommunityListDataService.filtersToLoad;
    this.displayedColumns = this.assignedCommunityListDataService.displayedColumns;

  }

  filter(event: TableFilterValueModel): void {
    this.filterTerm = event;
  }

  addCommunities(): void {
    this.router.navigate(['/responder-access/community-management/add-communities']);
  }

  communitiesFilterPredicate(): void {
    const filterPredicate = (data: TeamCommunityModel, filter: string): boolean => {
      const searchString: TableFilterValueModel = JSON.parse(filter);
      if (searchString.value === 'All Regional Districts' || searchString.value === 'All Types') {
        return true;
      }
      if (searchString.type === 'text') {
        return (data.name.trim().toLowerCase().indexOf(searchString.value.trim().toLowerCase()) !== -1);
      } else {
        return data.districtName.trim().toLowerCase().indexOf(searchString.value.trim().toLowerCase()) !== -1 ||
          data.type.trim().toLowerCase().indexOf(searchString.value.trim().toLowerCase()) !== -1;
      }
    };
    this.filterPredicate = filterPredicate;
  }

  communitiesToDelete($event): void {
    this.communitiesToDeleteList = $event;
    this.assignedCommunityListDataService.setCommunitiesToDelete($event);
  }

  deleteCommunities(): void {
    this.router.navigate(['/responder-access/community-management/review'], {queryParams: {action: 'delete'}});
  }

}
