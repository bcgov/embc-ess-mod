import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Community } from 'src/app/core/api/models';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { TeamCommunityModel } from 'src/app/core/models/team-community.model';
import { AssignedCommunityListDataService } from 'src/app/feature-components/assigned-community/assigned-community-list/assigned-community-list-data.service';
import { AddCommunityService } from './add-community.service';

@Component({
  selector: 'app-add-community',
  templateUrl: './add-community.component.html',
  styleUrls: ['./add-community.component.scss']
})
export class AddCommunityComponent implements OnInit {

  constructor(private assignedCommunityListDataService: AssignedCommunityListDataService,
              private router: Router, private addCommunityService: AddCommunityService) { }

  communities: TeamCommunityModel[];
  filterTerm: TableFilterValueModel;
  selectedCommunitiesList: Community[] = [];
  filterPredicate: (data: Community, filter: string) => boolean;
  filtersToLoad: TableFilterModel;
  displayedColumns: TableColumnModel[];
  isLoading = false;

  /**
   * On component init, loads the eligible communities list and filters
   */
  ngOnInit(): void {
    this.communitiesFilterPredicate();
    this.assignedCommunityListDataService.getCommunitiesToAddList().pipe(delay(1000)).subscribe(values => {
      this.isLoading = !this.isLoading;
      this.communities = values;
    });
    this.filtersToLoad = this.addCommunityService.filtersToLoad;
    this.displayedColumns = this.addCommunityService.displayedColumns;
  }

  /**
   * Custom filter predicate for eligible community list
   */
  communitiesFilterPredicate(): void {
    const filterPredicate = (data: Community, filter: string): boolean => {
      const searchString: TableFilterValueModel = JSON.parse(filter);
      if (searchString.value === 'All Regional Districts') {
        return true;
      }
      if (searchString.type === 'text') {
        return (data.name.trim().toLowerCase().indexOf(searchString.value.trim().toLowerCase()) !== -1);
      } else {
        return data.districtName.trim().toLowerCase().indexOf(searchString.value.trim().toLowerCase()) !== -1;
      }
    };
    this.filterPredicate = filterPredicate;
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
   * Sets the list of assigned comminities to add
   *
   * @param $event list of communities to add
   */
  selectedCommunities($event): void {
    this.selectedCommunitiesList = $event;
    this.addCommunityService.setAddedCommunities($event);
  }

  /**
   * Navigates to review page for adding new communities
   */
  addToMyList(): void {
    this.router.navigate(['/responder-access/community-management/review'], { queryParams: { action: 'add' } });
  }

  /**
   * Navigates to assigned community list
   */
  goToList(): void {
    this.router.navigate(['/responder-access/community-management/list-communities']);
  }
}
