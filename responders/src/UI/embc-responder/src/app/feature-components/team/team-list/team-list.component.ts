import { Component, OnInit } from '@angular/core';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements OnInit {

  constructor() { }

  filterTerm: TableFilterValueModel;
  filtersToLoad: TableFilterModel;
  filterPredicate: any;

  rolesList: string[] = ['All User Roles', 'Tier 1 Responder', 'Tier 2 Superviser', 'Tier 3 ESSD', 'Tier 4 LEP'];
  statusList: string[] = ['Active & Deactivated Users', 'Active', 'Deactivated'];
  labelsList: string[] = ['All Labels', 'Volunteer', 'EMBC Employee', 'Convergent Volunteer', '3rd Party'];

  displayedColumns: TableColumnModel[] = [
    { label: 'Last Name', ref: 'lastName' },
    { label: 'First Name', ref: 'firstName' },
    { label: 'BCeID Username', ref: 'bceid' },
    { label: 'Role', ref: 'role' },
    { label: 'Label', ref: 'label' },
    { label: 'Status', ref: 'status' },
  ];

  sampleCommunityData: Team[] = [
    { lastName: 'BURTON', firstName: 'Michael', bceid: 'RoMi1234', role: 'Tier 1 Responder', label: 'Volunteer', status: 'Active' },
    { lastName: 'EDWARDS', firstName: 'Jaimie', bceid: 'Test12', role: 'Tier 2 Superviser', label: '3rd Party', status: 'Deactivated' },
    { lastName: 'EDWARDS', firstName: 'Susan', bceid: 'Test123', role: 'Tier 1 Responder', label: '3rd Party', status: 'Active' },
    { lastName: 'BURTON1', firstName: 'Michael', bceid: '1234', role: 'Tier 1 Responder', label: 'Volunteer', status: 'Deactivated' },
    { lastName: 'EDWARDS11', firstName: 'Jaimie', bceid: '12', role: 'Tier 2 Superviser', label: '3rd Party', status: 'Deactivated' },
    { lastName: 'EDWARDS111', firstName: 'Susan', bceid: '123', role: 'Tier 1 Responder', label: 'Volunteer', status: 'Active' }
  ];

  ngOnInit(): void {
    this.filtersToLoad = {
      loadDropdownFilters: [{
        type: 'role',
        label: 'All User Roles',
        values: this.rolesList
      },
      {
        type: 'status',
        label: 'Active & Deactivated Users',
        values: this.statusList
      },
      {
        type: 'label',
        label: 'All Labels',
        values: this.labelsList
      }],
      loadInputFilter: {
        type: 'Search by last name or BCeID',
        label: 'Search by last name or BCeID'
      }
    };
    this.teamFilterPredicate();
  }

  filter(event: TableFilterValueModel): void {
    this.filterTerm = event;
  }

  teamFilterPredicate(): void {
    const filterPredicate = (data: Team, filter: string): boolean => {
      const searchString: TableFilterValueModel = JSON.parse(filter);
      if (searchString.value === 'All User Roles' || searchString.value === 'Active & Deactivated Users' || searchString.value === 'All Labels') {
        return true;
      }
      if (searchString.type === 'text') {
        if (data.lastName.trim().toLowerCase().indexOf(searchString.value.trim().toLowerCase()) !== -1) {
          return true;
        }
        else if (data.bceid.trim().toLowerCase().indexOf(searchString.value.trim().toLowerCase()) !== -1) {
          return true;
 }
        else { return false; }
      } else {
        return data.role.trim().toLowerCase().indexOf(searchString.value.trim().toLowerCase()) !== -1 ||
          data.status.trim().toLowerCase().indexOf(searchString.value.trim().toLowerCase()) !== -1 ||
          data.label.trim().toLowerCase().indexOf(searchString.value.trim().toLowerCase()) !== -1;
      }

      // if (searchString.type === 'role') {
      //   return data.role.toLowerCase().trim().indexOf(searchString.value.toLowerCase()) != -1
      // }

      // if (searchString.type === 'status') {
      //   return data.status.toLowerCase().trim().indexOf(searchString.value.toLowerCase()) != -1
      // }

      // if (searchString.type === 'label') {
      //   return data.label.toLowerCase().trim().indexOf(searchString.value.toLowerCase()) != -1
      // }
    };
    this.filterPredicate = filterPredicate;
  }
}

export interface Team {
  lastName: string;
  firstName: string;
  bceid: string;
  role: string;
  label: string;
  status: string;
}


