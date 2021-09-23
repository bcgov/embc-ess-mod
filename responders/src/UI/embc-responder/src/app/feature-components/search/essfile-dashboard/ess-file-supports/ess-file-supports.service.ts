import { Injectable } from '@angular/core';
import { Code } from 'src/app/core/api/models';
import { SupportStatus } from 'src/app/core/api/models/support-status';
import { ConfigurationService } from 'src/app/core/api/services';
import {
  ObjectWrapper,
  TableFilterModel
} from 'src/app/core/models/table-filter.model';
import { StepSupportsService } from 'src/app/feature-components/wizard/step-supports/step-supports.service';

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

  private supportCategory: Code[] = [];

  constructor(private configService: ConfigurationService) {
    this.getCategoryList();
  }

  public load(): TableFilterModel {
    return {
      loadDropdownFilters: [
        {
          type: 'type',
          label: this.defaultType,
          values: this.supportCategory
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

  public getCategoryList(): void {
    this.configService
      .configurationGetCodes({ forEnumType: 'SupportCategory' })
      .subscribe((categories: Code[]) => {
        this.supportCategory = categories.filter(
          (category) => category.description !== null
        );
      });
  }
}
