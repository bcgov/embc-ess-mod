import { Component, OnInit } from '@angular/core';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';

@Component({
  selector: 'app-community-list',
  templateUrl: './community-list.component.html',
  styleUrls: ['./community-list.component.scss']
})
export class CommunityListComponent implements OnInit {

  filterTerm: TableFilterValueModel;
  filtersToLoad: TableFilterModel;

  constructor() { }

  displayedColumns: TableColumnModel[] = [
    {label: 'Community', ref: 'community'},
    {label: 'Regional District', ref: 'regionalDistrict'},
    {label: 'Type', ref: 'type'},
    {label: 'Date Added to List', ref: 'date'},
  ];

  sampleCommunityData = [
    {community: 'Community Name', regionalDistrict: 'Cariboo', type: 'First Nations Community', date: 'mm/dd/yyyy'},
    {community: 'Community Name', regionalDistrict: 'Victoria', type: 'City', date: 'mm/dd/yyyy'},
    {community: 'Community Name', regionalDistrict: 'Cariboo', type: 'First Nations Community', date: 'mm/dd/yyyy'}
  ];

  regionalDistrictList: string[] = ['Cariboo', 'Victoria', 'Comox Valley'];
  typesList: string[] = ['First Nations Community', 'City'];

  ngOnInit(): void {

    this.filtersToLoad = {
      loadDropdownFilters: [{
        type: 'regionalDistrict',
        label: 'All Regional Districts',
        values: this.regionalDistrictList
      },
      {
        type: 'type',
        label: 'All Types',
        values: this.typesList
      }],
      loadInputFilter: {
        type: 'Search by city, town, village or community',
        label: 'Search by city, town, village or community'
      }
    }
  }

  filter(event: TableFilterValueModel) {
    this.filterTerm = event;
  }

}
