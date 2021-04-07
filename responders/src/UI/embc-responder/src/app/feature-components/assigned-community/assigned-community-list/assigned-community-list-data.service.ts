import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommunityType } from 'src/app/core/api/models';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { ObjectWrapper, TableFilterModel } from 'src/app/core/models/table-filter.model';
import { TeamCommunityModel } from 'src/app/core/models/team-community.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { LoadLocationsService } from 'src/app/core/services/load-locations.service';

@Injectable({ providedIn: 'root' })
export class AssignedCommunityListDataService {

  constructor(private loadLocationService: LoadLocationsService, private cacheService: CacheService) { }

  private teamCommunityList: TeamCommunityModel[];
  private allTeamCommunityList: TeamCommunityModel[];
  private communitiesToDelete: TeamCommunityModel[];
  defaultDistrict: ObjectWrapper = {code: 'All Districts', description: 'All Regional Districts'};
  defaultTypes: ObjectWrapper = {code: 'All Types', description: 'All Types'};

  public filtersToLoad: TableFilterModel = {
    loadDropdownFilters: [{
      type: 'regionalDistrict',
      label: this.defaultDistrict,
      values: this.loadLocationService.getRegionalDistricts()
    },
    {
      type: 'type',
      label: this.defaultTypes,
      values: Object.keys(CommunityType).filter(e => e)
    }],
    loadInputFilter: {
      type: 'Search by city, town, village or community',
      label: 'Search by city, town, village or community'
    }
  };

  public displayedColumns: TableColumnModel[] = [
    { label: 'select', ref: 'select' },
    { label: 'Community', ref: 'name' },
    { label: 'Regional District', ref: 'districtName' },
    { label: 'Type', ref: 'type' },
    { label: 'Date Added to List', ref: 'dateAssigned' },
  ];

  public setCommunitiesToDelete(communitiesToDelete: TeamCommunityModel[]): void {
    this.communitiesToDelete = communitiesToDelete;
  }

  public getCommunitiesToDelete(): TeamCommunityModel[] {
    return this.communitiesToDelete;
  }

  public setTeamCommunityList(teamCommunityList: TeamCommunityModel[]): void {
    this.cacheService.set('teamCommunityList', teamCommunityList);
    this.teamCommunityList = teamCommunityList;
  }

  private getTeamCommunityList(): TeamCommunityModel[] {
    return this.teamCommunityList ? this.teamCommunityList :
      JSON.parse(this.cacheService.get('teamCommunityList'));
  }

  public setAllTeamCommunityList(allTeamCommunityList: TeamCommunityModel[]): void {
    this.cacheService.set('allTeamCommunityList', allTeamCommunityList);
    this.allTeamCommunityList = allTeamCommunityList;
  }

  private getAllTeamCommunityList(): TeamCommunityModel[] {
    return this.allTeamCommunityList ? this.allTeamCommunityList :
      JSON.parse(this.cacheService.get('allTeamCommunityList'));
  }

  public getCommunitiesToAddList(): Observable<TeamCommunityModel[]> {
    const conflictMap: TeamCommunityModel[] = this.mergedCommunityList().map(values => {
      const conflicts = this.getAllTeamCommunityList().find(x => x.code === values.code);
      return this.mergeData(values, conflicts);
    });
    const addMap: TeamCommunityModel[] = conflictMap.map(values => {
      const existing = this.getTeamCommunityList().find(x => x.code === values.code);
      return this.mergeData(values, existing);
    });
    return of(addMap);
  }

  private mergedCommunityList(): TeamCommunityModel[] {
    const teamModel: TeamCommunityModel = {
      allowSelect: true,
      conflict: false
    };
    return this.loadLocationService.getCommunityList().map(community => this.mergeData(teamModel, community));
  }

  private mergeData<T>(finalValue: T, incomingValue: Partial<T>): T {
    return { ...finalValue, ...incomingValue };
  }

}
