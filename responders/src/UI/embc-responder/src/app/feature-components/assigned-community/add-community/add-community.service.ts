import { Injectable } from '@angular/core';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { ObjectWrapper, TableFilterModel } from 'src/app/core/models/table-filter.model';
import { TeamCommunityModel } from 'src/app/core/models/team-community.model';
import { LoadLocationsService } from 'src/app/core/services/load-locations.service';

@Injectable({ providedIn: 'root' })
export class AddCommunityService {

    private addedCommunities: TeamCommunityModel[];
    defaultDistrict: ObjectWrapper = {code: 'All Districts', description: 'All Regional Districts'};

    constructor(private loadLocationService: LoadLocationsService) { }

    public filtersToLoad: TableFilterModel = {
        loadDropdownFilters: [{
          type: 'regionalDistrict',
          label: this.defaultDistrict,
          values: this.loadLocationService.getRegionalDistricts()
        }],
        loadInputFilter: {
          type: 'Search by city, town, village or community',
          label: 'Search by city, town, village or community'
        }
      };

    public  displayedColumns: TableColumnModel[] = [
        { label: 'select', ref: 'select' },
        { label: '', ref: 'action' },
        { label: 'Community', ref: 'name' },
        { label: 'Regional District', ref: 'districtName' },
        { label: 'Type', ref: 'type' }
      ];

    public setAddedCommunities(addedCommunities: TeamCommunityModel[]): void {
        this.addedCommunities = addedCommunities;
    }

    public getAddedCommunities(): TeamCommunityModel[] {
       return this.addedCommunities;
    }
}
