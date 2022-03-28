import { Injectable } from '@angular/core';
import { Code } from 'src/app/core/api/models';
import { SupportStatus } from 'src/app/core/api/models/support-status';
import {
  ObjectWrapper,
  TableFilterModel
} from 'src/app/core/models/table-filter.model';
import { LoadEvacueeListService } from 'src/app/core/services/load-evacuee-list.service';

@Injectable({ providedIn: 'root' })
export class ViewSupportsService {
  typesList: Code[] = this.loadEvacueeListService.getSupportCategories();
  defaultType: ObjectWrapper = {
    code: 'Support Type',
    description: 'All Support Types'
  };

  defaultStatus: ObjectWrapper = {
    code: 'All Status',
    description: 'All Status'
  };

  constructor(public loadEvacueeListService: LoadEvacueeListService) {}

  public load(): TableFilterModel {
    return {
      loadDropdownFilters: [
        {
          type: 'type',
          label: this.defaultType,
          values: this.loadEvacueeListService.getSupportCategories()
        },
        {
          type: 'status',
          label: this.defaultStatus,
          values: this.loadEvacueeListService
            .getSupportStatus()
            .filter(
              (status, index, self) =>
                status.description &&
                self.findIndex((s) => s.description === status.description) ===
                  index
            )
        }
      ]
    };
  }
}
