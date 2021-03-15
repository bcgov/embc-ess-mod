import { Injectable } from '@angular/core';
import { TeamMember } from 'src/app/core/api/models';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({ providedIn: 'root' })
export class TeamListDataService {

  private selectedTeamMember: TeamMember;

  constructor(private cacheService: CacheService) { }

  rolesList: string[] = ['All User Roles', 'Tier 1 Responder', 'Tier 2 Superviser', 'Tier 3 ESSD', 'Tier 4 LEP'];
  statusList: string[] = ['Active & Deactivated Users', 'Active', 'Deactivated'];
  labelsList: string[] = ['All Labels', 'Volunteer', 'EMBC Employee', 'Convergent Volunteer', '3rd Party'];

  public filtersToLoad: TableFilterModel = {
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

  public displayedColumns: TableColumnModel[] = [
    { label: 'Last Name', ref: 'lastName' },
    { label: 'First Name', ref: 'firstName' },
    { label: 'BCeID Username', ref: 'userName' },
    { label: 'Role', ref: 'role' },
    { label: 'Label', ref: 'label' },
    { label: 'Status', ref: 'isActive' },
  ];

  public getSelectedTeamMember(): TeamMember {
    return this.selectedTeamMember ? this.selectedTeamMember :
      JSON.parse(this.cacheService.get('selectedTeamMember'));
  }

  public setSelectedTeamMember(selectedTeamMember: TeamMember): void {
    this.cacheService.set('selectedTeamMember', selectedTeamMember);
    this.selectedTeamMember = selectedTeamMember;
  }



}
