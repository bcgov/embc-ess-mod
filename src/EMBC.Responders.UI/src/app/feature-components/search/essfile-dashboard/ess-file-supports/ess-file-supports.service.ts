import { Injectable } from '@angular/core';
import { SupportStatus } from 'src/app/core/api/models/support-status';
import {
  ObjectWrapper,
  TableFilterModel
} from 'src/app/core/models/table-filter.model';
import { EvacueeSearchService } from '../../evacuee-search/evacuee-search.service';

@Injectable({ providedIn: 'root' })
export class EssFileSupportsService {
  defaultType: ObjectWrapper = {
    code: 'Support Type',
    description: 'All Support Types'
  };

  defaultStatus: ObjectWrapper = {
    code: 'All Status',
    description: 'All Status'
  };

  constructor(private evacueeSearchService: EvacueeSearchService) {}

  public load(): TableFilterModel {
    return {
      loadDropdownFilters: [
        {
          type: 'type',
          label: this.defaultType,
          values: this.evacueeSearchService.supportCategory
        },
        {
          type: 'status',
          label: this.defaultStatus,
          values: this.statusList()
        }
      ]
    };
  }

  statusList() {
    const status = [];
    for (const [propertyKey, propertyValue] of Object.entries(SupportStatus)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }
      if (propertyKey !== 'Draft') {
        status.push({ code: propertyValue, description: propertyKey });
      }
    }
    return status;
  }
}
