import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';

@Injectable({ providedIn: 'root' })
export class AssignedCommunityListDataService {

    regionalDistrictList: string[] = ['Cariboo', 'Victoria', 'Comox Valley'];
    typesList: string[] = ['First Nations Community', 'City'];

    filtersToLoad: TableFilterModel = {
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

      displayedColumns: TableColumnModel[] = [
        { label: 'Community', ref: 'name' },
        { label: 'Regional District', ref: 'districtName' },
        { label: 'Type', ref: 'type' },
        { label: 'Date Added to List', ref: 'date' },
      ];
    
}
