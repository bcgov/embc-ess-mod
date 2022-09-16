import { Injectable } from '@angular/core';
import { EvacuationFileStatus, TaskWorkflow } from '../core/api/models';
import { AppBaseModel } from '../core/models/appBase.model';
import { EssTaskModel } from '../core/models/ess-task.model';
import { AppBaseService } from '../core/services/helper/appBase.service';

@Injectable({ providedIn: 'root' })
export class MockAppBaseService extends AppBaseService {
  public appModelTestVal: AppBaseModel;
  fileStatus: EvacuationFileStatus;

  public enabledAllWorkflowsTask: EssTaskModel = {
    communityCode: '986adfaf-9f97-ea11-b813-005056830319',
    communityName: 'Vancouver',
    description: 'DEV Task',
    endDate: '2023-12-03T03:32:00Z',
    id: '1234',
    startDate: '2021-11-29T19:32:00Z',
    status: 'Active',
    workflows: [
      { enabled: true, name: 'digital-processing' },
      {
        enabled: true,
        name: 'paper-data-entry'
      },
      {
        enabled: true,
        name: 'remote-extensions'
      }
    ]
  };

  public enabledPaperBasedWorkflowTask: EssTaskModel = {
    communityCode: '986adfaf-9f97-ea11-b813-005056830319',
    communityName: 'Victoria',
    description: 'DEV Task',
    endDate: '2023-12-03T03:32:00Z',
    id: '5678',
    startDate: '2021-11-29T19:32:00Z',
    status: 'Active',
    workflows: [
      { enabled: false, name: 'digital-processing' },
      {
        enabled: true,
        name: 'paper-data-entry'
      },
      {
        enabled: false,
        name: 'remote-extensions'
      }
    ]
  };

  public disableRemoteExtWorkflowTask: EssTaskModel = {
    communityCode: '986adfaf-9f97-ea11-b813-005056830319',
    communityName: 'Nanaimo',
    description: 'DEV Task',
    endDate: '2023-12-03T03:32:00Z',
    id: '9012',
    startDate: '2021-11-29T19:32:00Z',
    status: 'Active',
    workflows: [
      { enabled: true, name: 'digital-processing' },
      {
        enabled: true,
        name: 'paper-data-entry'
      },
      {
        enabled: false,
        name: 'remote-extensions'
      }
    ]
  };

  public get appModel(): AppBaseModel {
    return this.appModelTestVal;
  }

  public set appModel(value: Partial<AppBaseModel>) {
    this.appModelTestVal = { ...this.appModel, ...value };
  }
}
