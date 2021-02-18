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

  filterTerm: TableFilterValueModel;
  filtersToLoad: TableFilterModel[];

  constructor() { }

  ngOnInit(): void {
    this.filtersToLoad = 
      [{
        type: 'role',
        label: 'All User Roles',
        values: this.rolesList
      },
      {
        type: 'status',
        label: 'Active Users Only',
        values: this.statusList
      },
      {
        type: 'label',
        label: 'All Labels',
        values: this.labelsList
      }
    ]
  }

  rolesList: string[] = ['All User Roles', 'Tier 1 Responder', 'Tier 2 Superviser', 'Tier 3 ESSD', 'Tier 4 LEP'];
  statusList: string[] = ['Active & Deactivated Users', 'Active Users Only', 'Active Users Only'];
  labelsList: string[] = ['All Labels', 'Volunteer', 'EMBC Employee', 'Convergent Volunteer', '3rd Party'];

  displayedColumns: TableColumnModel[] = [
    { label: 'Last Name', ref: 'lastName' },
    { label: 'First Name', ref: 'firstName' },
    { label: 'BCeID Username', ref: 'bceid' },
    { label: 'Role', ref: 'role' },
    { label: 'Label', ref: 'label' },
    { label: 'Status', ref: 'status' },
  ];

  sampleCommunityData = [
    { lastName: 'BURTON', firstName: 'Michael', bceid: 'RoMi1234', role: 'Tier 1 Responder', label: 'Volunteer', status: 'Active Users Only' },
    { lastName: 'EDWARDS', firstName: 'Jaimie', bceid: 'Test12', role: 'Tier 2 Superviser', label: '3rd Party', status: 'Active Users Only' },
    { lastName: 'EDWARDS', firstName: 'Susan', bceid: 'Test123', role: 'Tier 1 Responder', label: 'Volunteer', status: 'Active Users Only' }
  ];

  filter(event: TableFilterValueModel) {
    this.filterTerm = event;
  }
}
