import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Code } from '../core/api/models';
import { LoadEvacueeListService } from '../core/services/load-evacuee-list.service';

@Injectable({ providedIn: 'root' })
export class MockEvacueeListService extends LoadEvacueeListService {
  public categoryList: Code[] = [
    {
      type: 'SupportCategory',
      value: 'Unknown',
      description: '',
      parentCode: null
    },
    {
      type: 'SupportCategory',
      value: 'Clothing',
      description: 'Clothing',
      parentCode: null
    },
    {
      type: 'SupportCategory',
      value: 'Food',
      description: 'Food',
      parentCode: null
    },
    {
      type: 'SupportCategory',
      value: 'Incidentals',
      description: 'Incidentals',
      parentCode: null
    },
    {
      type: 'SupportCategory',
      value: 'Lodging',
      description: 'Lodging',
      parentCode: null
    },
    {
      type: 'SupportCategory',
      value: 'Transportation',
      description: 'Transportation',
      parentCode: null
    }
  ];

  public subCategoryList: Code[] = [
    {
      type: 'SupportSubCategory',
      value: 'None',
      description: '',
      parentCode: null
    },
    {
      type: 'SupportSubCategory',
      value: 'Lodging_Hotel',
      description: 'Lodging - Hotel/Motel/Campground',
      parentCode: null
    },
    {
      type: 'SupportSubCategory',
      value: 'Lodging_Billeting',
      description: 'Lodging - Billeting',
      parentCode: null
    },
    {
      type: 'SupportSubCategory',
      value: 'Lodging_Group',
      description: 'Lodging - Group Lodging',
      parentCode: null
    },
    {
      type: 'SupportSubCategory',
      value: 'Food_Groceries',
      description: 'Food - Groceries',
      parentCode: null
    },
    {
      type: 'SupportSubCategory',
      value: 'Food_Restaurant',
      description: 'Food - Restaurant Meals',
      parentCode: null
    },
    {
      type: 'SupportSubCategory',
      value: 'Transportation_Taxi',
      description: 'Transportation - Taxi',
      parentCode: null
    },
    {
      type: 'SupportSubCategory',
      value: 'Transportation_Other',
      description: 'Transportation - Other',
      parentCode: null
    }
  ];

  public supportStatus: Code[] = [
    {
      type: 'SupportStatus',
      value: 'Draft',
      description: 'Draft',
      parentCode: null
    },
    {
      type: 'SupportStatus',
      value: 'Active',
      description: 'Active',
      parentCode: null
    },
    {
      type: 'SupportStatus',
      value: 'Expired',
      description: 'Expired',
      parentCode: null
    },
    {
      type: 'SupportStatus',
      value: 'Void',
      description: 'Void',
      parentCode: null
    },
    {
      type: 'SupportStatus',
      value: 'PendingApproval',
      description: 'Pending Approval',
      parentCode: null
    },
    {
      type: 'SupportStatus',
      value: 'UnderReview',
      description: 'Pending Approval',
      parentCode: null
    },
    {
      type: 'SupportStatus',
      value: 'Approved',
      description: 'Approved',
      parentCode: null
    },
    {
      type: 'SupportStatus',
      value: 'Paid',
      description: 'Paid',
      parentCode: null
    },
    {
      type: 'SupportStatus',
      value: 'Cancelled',
      description: 'Cancelled',
      parentCode: null
    }
  ];

  public supportMethods: Code[] = [
    {
      type: 'SupportMethod',
      value: 'Unknown',
      description: '',
      parentCode: null
    },
    {
      type: 'SupportMethod',
      value: 'Referral',
      description: 'Referral',
      parentCode: null
    },
    {
      type: 'SupportMethod',
      value: 'ETransfer',
      description: 'e-Transfer',
      parentCode: null
    }
  ];

  public loadStaticEvacueeLists(): Promise<void> {
    return Promise.resolve();
  }

  public getSupportCategories(): Code[] {
    return this.categoryList;
  }

  public getSupportSubCategories(): Code[] {
    return this.subCategoryList;
  }

  public getSupportStatus(): Code[] {
    return this.supportStatus;
  }

  public getSupportMethods(): Code[] {
    return this.supportMethods;
  }
}
