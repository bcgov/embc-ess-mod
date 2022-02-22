import { Injectable } from '@angular/core';
import { TabModel } from '../core/models/tab.model';
import { StepEssFileService } from '../feature-components/wizard/step-ess-file/step-ess-file.service';

@Injectable({
  providedIn: 'root'
})
export class MockStepEssFileService extends StepEssFileService {
  public essTabsValue: Array<TabModel>;

  public get essTabs(): Array<TabModel> {
    return this.essTabsValue;
  }
  public set essTabs(essTabsValue: Array<TabModel>) {
    this.essTabsValue = essTabsValue;
  }

  public essFileTabs: Array<TabModel> = [
    {
      label: 'Evacuation Details',
      route: 'evacuation-details',
      name: 'evacuation-details',
      status: 'not-started',
      next: '/ess-wizard/ess-file/household-members'
    },
    {
      label: 'Household Members',
      route: 'household-members',
      name: 'household-members',
      status: 'not-started',
      next: '/ess-wizard/ess-file/animals',
      previous: '/ess-wizard/ess-file/evacuation-details'
    },
    {
      label: 'Animals',
      route: 'animals',
      name: 'animals',
      status: 'not-started',
      next: '/ess-wizard/ess-file/needs',
      previous: '/ess-wizard/ess-file/household-members'
    },
    {
      label: 'Needs',
      route: 'needs',
      name: 'needs',
      status: 'not-started',
      next: '/ess-wizard/ess-file/security-phrase',
      previous: '/ess-wizard/ess-file/animals'
    },
    {
      label: 'Security Phrase',
      route: 'security-phrase',
      name: 'security-phrase',
      status: 'not-started',
      next: '/ess-wizard/ess-file/review',
      previous: '/ess-wizard/ess-file/needs'
    },
    {
      label: 'Review & Save',
      route: 'review',
      name: 'review',
      status: 'not-started',
      previous: '/ess-wizard/ess-file/security-phrase'
    }
  ];

  public paperEssFileTabs: Array<TabModel> = [
    {
      label: 'Evacuation Details',
      route: 'evacuation-details',
      name: 'evacuation-details',
      status: 'not-started',
      next: '/ess-wizard/ess-file/household-members'
    },
    {
      label: 'Household Members',
      route: 'household-members',
      name: 'household-members',
      status: 'not-started',
      next: '/ess-wizard/ess-file/animals',
      previous: '/ess-wizard/ess-file/evacuation-details'
    },
    {
      label: 'Animals',
      route: 'animals',
      name: 'animals',
      status: 'not-started',
      next: '/ess-wizard/ess-file/needs',
      previous: '/ess-wizard/ess-file/household-members'
    },
    {
      label: 'Needs',
      route: 'needs',
      name: 'needs',
      status: 'not-started',
      next: '/ess-wizard/ess-file/review',
      previous: '/ess-wizard/ess-file/animals'
    },
    {
      label: 'Review & Save',
      route: 'review',
      name: 'review',
      status: 'not-started',
      previous: '/ess-wizard/ess-file/needs'
    }
  ];
}
