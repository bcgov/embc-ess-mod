import { Injectable } from '@angular/core';
import { TabModel } from '../core/models/tab.model';
import { StepEvacueeProfileService } from '../feature-components/wizard/step-evacuee-profile/step-evacuee-profile.service';

@Injectable({
  providedIn: 'root'
})
export class MockStepEvacueeProfileService extends StepEvacueeProfileService {
  public profileTabsValue: Array<TabModel>;

  public get profileTabs(): Array<TabModel> {
    return this.profileTabsValue;
  }
  public set profileTabs(profileTabsValue: Array<TabModel>) {
    this.profileTabsValue = profileTabsValue;
  }

  public evacueeProfileTabs: Array<TabModel> = [
    {
      label: 'Collection Notice',
      route: 'collection-notice',
      name: 'collection-notice',
      status: 'not-started',
      next: '/ess-wizard/evacuee-profile/restriction'
    },
    {
      label: 'Restriction',
      route: 'restriction',
      name: 'restriction',
      status: 'not-started',
      next: '/ess-wizard/evacuee-profile/evacuee-details',
      previous: '/ess-wizard/evacuee-profile/collection-notice'
    },
    {
      label: 'Evacuee Details',
      route: 'evacuee-details',
      name: 'evacuee-details',
      status: 'incomplete',
      next: '/ess-wizard/evacuee-profile/address',
      previous: '/ess-wizard/evacuee-profile/restriction'
    },
    {
      label: 'Address',
      route: 'address',
      name: 'address',
      status: 'not-started',
      next: '/ess-wizard/evacuee-profile/contact',
      previous: '/ess-wizard/evacuee-profile/evacuee-details'
    },
    {
      label: 'Contact',
      route: 'contact',
      name: 'contact',
      status: 'not-started',
      next: '/ess-wizard/evacuee-profile/security-questions',
      previous: '/ess-wizard/evacuee-profile/address'
    },
    {
      label: 'Security Questions',
      route: 'security-questions',
      name: 'security-questions',
      status: 'not-started',
      next: '/ess-wizard/evacuee-profile/review',
      previous: '/ess-wizard/evacuee-profile/contact'
    },
    {
      label: 'Review & Save',
      route: 'review',
      name: 'review',
      status: 'not-started',
      previous: '/ess-wizard/evacuee-profile/security-questions'
    }
  ];

  public paperEvacueeProfileTabs: Array<TabModel> = [
    {
      label: 'Collection Notice',
      route: 'collection-notice',
      name: 'collection-notice',
      status: 'not-started',
      next: '/ess-wizard/evacuee-profile/restriction'
    },
    {
      label: 'Restriction',
      route: 'restriction',
      name: 'restriction',
      status: 'not-started',
      next: '/ess-wizard/evacuee-profile/evacuee-details',
      previous: '/ess-wizard/evacuee-profile/collection-notice'
    },
    {
      label: 'Evacuee Details',
      route: 'evacuee-details',
      name: 'evacuee-details',
      status: 'incomplete',
      next: '/ess-wizard/evacuee-profile/address',
      previous: '/ess-wizard/evacuee-profile/restriction'
    },
    {
      label: 'Address',
      route: 'address',
      name: 'address',
      status: 'not-started',
      next: '/ess-wizard/evacuee-profile/contact',
      previous: '/ess-wizard/evacuee-profile/evacuee-details'
    },
    {
      label: 'Contact',
      route: 'contact',
      name: 'contact',
      status: 'not-started',
      next: '/ess-wizard/evacuee-profile/review',
      previous: '/ess-wizard/evacuee-profile/address'
    },
    {
      label: 'Review & Save',
      route: 'review',
      name: 'review',
      status: 'not-started',
      previous: '/ess-wizard/evacuee-profile/contact'
    }
  ];
}
