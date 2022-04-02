import { Injectable } from '@angular/core';
import {
  MemberLabelDescription,
  MemberRoleDescription,
  TeamMember
} from 'src/app/core/api/models';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import {
  ObjectWrapper,
  TableFilterModel
} from 'src/app/core/models/table-filter.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { LoadTeamListService } from 'src/app/core/services/load-team-list.service';

@Injectable({ providedIn: 'root' })
export class TeamListDataService {
  rolesList: MemberRoleDescription[] = this.listService.getMemberRoles();
  defaultRole: ObjectWrapper = {
    code: 'All Roles',
    description: 'All User Roles'
  };
  defaultStatus: ObjectWrapper = {
    code: null,
    description: 'Active & Deactivated Users'
  };
  statusList: Array<{ code: boolean; description: string }> = [
    { code: true, description: 'Active' },
    { code: false, description: 'Deactivated' }
  ];
  labelsList: MemberLabelDescription[] = this.listService.getMemberLabels();
  defaultLabel: ObjectWrapper = {
    code: 'All Labels',
    description: 'All Labels'
  };

  public filtersToLoad: TableFilterModel = {
    loadDropdownFilters: [
      {
        type: 'role',
        label: this.defaultRole,
        values: this.rolesList
      },
      {
        type: 'status',
        label: this.defaultStatus,
        values: this.statusList
      },
      {
        type: 'label',
        label: this.defaultLabel,
        values: this.labelsList.filter((label) => label.description !== '')
      }
    ],
    loadInputFilter: {
      type: 'Search by last name or BCeID',
      label: 'Search by last name or BCeID'
    }
  };

  public displayedColumns: TableColumnModel[] = [
    { label: 'Last Name', ref: 'lastName' },
    { label: 'First Name', ref: 'firstName' },
    { label: 'BCeID Username', ref: 'userName' },
    { label: 'Role', ref: 'roleDescription' },
    { label: 'Label', ref: 'labelDescription' },
    { label: 'Status', ref: 'isActive' }
  ];

  private selectedTeamMember: TeamMember;

  constructor(
    private cacheService: CacheService,
    private listService: LoadTeamListService
  ) {}

  public getSelectedTeamMember(): TeamMember {
    return this.selectedTeamMember
      ? this.selectedTeamMember
      : JSON.parse(this.cacheService.get('selectedTeamMember'));
  }

  public setSelectedTeamMember(selectedTeamMember: TeamMember): void {
    this.cacheService.set('selectedTeamMember', selectedTeamMember);
    this.selectedTeamMember = selectedTeamMember;
  }

  clear(): void {
    this.cacheService.remove('selectedTeamMember');
  }
}
