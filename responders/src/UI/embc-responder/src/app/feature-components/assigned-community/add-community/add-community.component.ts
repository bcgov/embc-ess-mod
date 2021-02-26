import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Community } from 'src/app/core/api/models';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { AssignedCommunityListDataService } from 'src/app/feature-components/assigned-community/assigned-community-list/assigned-community-list-data.service';
import { AlertService } from '../../../shared/components/alert/alert.service';

@Component({
  selector: 'app-add-community',
  templateUrl: './add-community.component.html',
  styleUrls: ['./add-community.component.scss']
})
export class AddCommunityComponent implements OnInit {

  constructor(private assignedCommunityListDataService: AssignedCommunityListDataService, private alertService: AlertService,
    private router: Router) { }

  ngOnInit(): void {
    console.log(this.assignedCommunityListDataService.getCommunitiesToAddList())
    this.communities = this.assignedCommunityListDataService.getCommunitiesToAddList();
  }

  regionalDistrictList: string[] = ['Cariboo', 'Victoria', 'Comox Valley'];
  typesList: string[] = ['First Nations Community', 'City'];
  communities: Community[];
  filterTerm: TableFilterValueModel;
  selectedCommunitiesList: Community[] =[];

  filter(event: TableFilterValueModel) {
    this.filterTerm = event;
  }

  filtersToLoad: TableFilterModel = {
    loadDropdownFilters: [{
      type: 'regionalDistrict',
      label: 'All Regional Districts',
      values: this.regionalDistrictList
    }],
    loadInputFilter: {
      type: 'Search by city, town, village or community',
      label: 'Search by city, town, village or community'
    }
  }

  displayedColumns: TableColumnModel[] = [
    { label: 'select', ref: 'select' },
    { label: '', ref: 'action' },
    { label: 'Community', ref: 'name' },
    { label: 'Regional District', ref: 'districtName' },
    { label: 'Type', ref: 'type' }
  ];

  selectedCommunities($event) {
    this.selectedCommunitiesList = $event;
}

addToMyList() {
    console.log(this.selectedCommunitiesList);
    this.alertService.setAlert('warning', 'Conflicts Detected');
  }

  goToList() {
    this.router.navigate(['/responder-access/community-management/list'])
  }
}
