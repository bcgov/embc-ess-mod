import { Injectable } from '@angular/core';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import {
  ObjectWrapper,
  TableFilterModel
} from 'src/app/core/models/table-filter.model';
import { TeamCommunityModel } from 'src/app/core/models/team-community.model';
import { LocationsService } from 'src/app/core/services/locations.service';

@Injectable({ providedIn: 'root' })
export class AddCommunityService {
  public defaultDistrict: ObjectWrapper = {
    code: 'All Districts',
    description: 'All Regional Districts'
  };

  public filtersToLoad: TableFilterModel = {
    loadDropdownFilters: [
      {
        type: 'regionalDistrict',
        label: this.defaultDistrict,
        values: this.loadLocationService.getRegionalDistricts()
      }
    ],
    loadInputFilter: {
      type: 'Search by city, town, village or community',
      label: 'Search by city, town, village or community'
    }
  };

  public displayedColumns: TableColumnModel[] = [
    { label: 'select', ref: 'select' },
    { label: '', ref: 'action' },
    { label: 'Community', ref: 'name' },
    { label: 'Regional District', ref: 'districtName' },
    { label: 'Type', ref: 'type' }
  ];
  private addedCommunities: TeamCommunityModel[];

  constructor(private loadLocationService: LocationsService) {}

  public setAddedCommunities(addedCommunities: TeamCommunityModel[]): void {
    this.addedCommunities = addedCommunities;
  }

  public getAddedCommunities(): TeamCommunityModel[] {
    return this.addedCommunities;
  }

  public clear() {
    this.setAddedCommunities([]);
  }
}
