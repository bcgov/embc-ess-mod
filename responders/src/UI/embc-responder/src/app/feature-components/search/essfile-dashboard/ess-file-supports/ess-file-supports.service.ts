import { Injectable } from '@angular/core';
import { SupportStatus } from 'src/app/core/api/models';
import {
  ObjectWrapper,
  TableFilterModel
} from 'src/app/core/models/table-filter.model';
import { LoadEvacueeListService } from 'src/app/core/services/load-evacuee-list.service';

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

  constructor(private loadEvacueeListService: LoadEvacueeListService) {}

  public load(): TableFilterModel {
    return {
      loadDropdownFilters: [
        {
          type: 'type',
          label: this.defaultType,
          values: this.loadEvacueeListService
            .getSupportCategories()
            .filter((category) => category.description !== '')
        },
        {
          type: 'status',
          label: this.defaultStatus,
          values: this.loadEvacueeListService
            .getSupportStatus()
            .filter(
              (support, index, self) =>
                support.description &&
                support.description !== SupportStatus.Draft &&
                self.findIndex((s) => s.description === support.description) ===
                  index
            )
        }
      ]
    };
  }
}
