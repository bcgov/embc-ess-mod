import { Injectable } from '@angular/core';
import { Code } from 'src/app/core/api/models';
import { SupportStatus } from 'src/app/core/api/models/support-status';
import {
  ObjectWrapper,
  TableFilterModel
} from 'src/app/core/models/table-filter.model';
import { StepSupportsService } from '../../step-supports/step-supports.service';

@Injectable({ providedIn: 'root' })
export class ViewSupportsService {
  typesList: Code[] = this.stepSupportsService.supportCategory;
  defaultType: ObjectWrapper = {
    code: 'Support Type',
    description: 'All Support Types'
  };

  defaultStatus: ObjectWrapper = {
    code: 'All Status',
    description: 'All Status'
  };

  constructor(public stepSupportsService: StepSupportsService) {}

  public load(): TableFilterModel {
    return {
      loadDropdownFilters: [
        {
          type: 'type',
          label: this.defaultType,
          values: this.stepSupportsService.supportCategory
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
      status.push({ code: propertyValue, description: propertyKey });
    }
    return status;
  }
}
