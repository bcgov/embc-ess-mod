import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Community } from 'src/app/core/api/models';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { TeamCommunityModel } from 'src/app/core/models/team-community.model';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { AssignedCommunityListDataService } from './assigned-community-list-data.service';
import { AssignedCommunityListService } from './assigned-community-list.service';
import * as globalConst from '../../../core/services/global-constants';

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

  constructor(private assignedCommunityListService: AssignedCommunityListService, private alertService: AlertService,
              private assignedCommunityListDataService: AssignedCommunityListDataService, private router: Router) { }

  ngOnInit(): void {
    this.communitiesFilterPredicate();
    this.assignedCommunityListService.getAssignedCommunityList().subscribe(values => {
      this.isLoading = !this.isLoading;
      this.assignedCommunities = values;
      this.assignedCommunityListDataService.setTeamCommunityList(values);
    }, (error) => {
      this.isLoading = !this.isLoading;
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.communityListError);
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
      if (searchString.type === 'text') {
        return (data.name.trim().toLowerCase().indexOf(searchString.value.trim().toLowerCase()) !== -1);
      } else if (searchString.type === 'array') {
        const terms = searchString.value.split(',');
        const districtTerm = terms[0];
        const typeTerm = terms[1];
        const matchFilter = [];
        const districtBoolean = data.districtName.trim().toLowerCase().indexOf(districtTerm.trim().toLowerCase()) !== -1;
        const typeBoolean =  data.type.trim().toLowerCase().indexOf(typeTerm.trim().toLowerCase()) !== -1;
        matchFilter.push(districtBoolean);
        matchFilter.push(typeBoolean);
        return matchFilter.every(Boolean);
      }
    };
    this.filterPredicate = filterPredicate;
  }

  communitiesToDelete($event): void {
    this.communitiesToDeleteList = $event;
    this.assignedCommunityListDataService.setCommunitiesToDelete($event);
  }

  deleteCommunities(): void {
    this.router.navigate(['/responder-access/community-management/review'], { queryParams: { action: 'delete' } });
  }

}
