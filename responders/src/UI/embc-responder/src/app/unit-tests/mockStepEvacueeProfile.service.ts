import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PersonDetails } from '../core/api/models';
import { TabModel } from '../core/models/tab.model';
import { ComputeRulesService } from '../core/services/computeRules.service';
import { AppBaseService } from '../core/services/helper/appBase.service';
import { LocationsService } from '../core/services/locations.service';
import { SecurityQuestionsService } from '../core/services/security-questions.service';
import { StepEvacueeProfileService } from '../feature-components/wizard/step-evacuee-profile/step-evacuee-profile.service';
import { WizardService } from '../feature-components/wizard/wizard.service';
import { AlertService } from '../shared/components/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class MockStepEvacueeProfileService extends StepEvacueeProfileService {
  public profileTabsValue: Array<TabModel>;

  personalDetailsVal: PersonDetails;

  public get profileTabs(): Array<TabModel> {
    return this.profileTabsValue;
  }
  public set profileTabs(profileTabsValue: Array<TabModel>) {
    this.profileTabsValue = profileTabsValue;
  }

  public get personalDetails(): PersonDetails {
    return this.personalDetailsVal;
  }
  public set personalDetails(personalDetailsVal: PersonDetails) {
    this.personalDetailsVal = personalDetailsVal;
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

  public completedPaperEvacueeProfileTabs: Array<TabModel> = [
    {
      label: 'Collection Notice',
      route: 'collection-notice',
      name: 'collection-notice',
      status: 'complete',
      next: '/ess-wizard/evacuee-profile/restriction'
    },
    {
      label: 'Restriction',
      route: 'restriction',
      name: 'restriction',
      status: 'complete',
      next: '/ess-wizard/evacuee-profile/evacuee-details',
      previous: '/ess-wizard/evacuee-profile/collection-notice'
    },
    {
      label: 'Evacuee Details',
      route: 'evacuee-details',
      name: 'evacuee-details',
      status: 'complete',
      next: '/ess-wizard/evacuee-profile/address',
      previous: '/ess-wizard/evacuee-profile/restriction'
    },
    {
      label: 'Address',
      route: 'address',
      name: 'address',
      status: 'complete',
      next: '/ess-wizard/evacuee-profile/contact',
      previous: '/ess-wizard/evacuee-profile/evacuee-details'
    },
    {
      label: 'Contact',
      route: 'contact',
      name: 'contact',
      status: 'complete',
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

  constructor(
    dialog: MatDialog,
    wizardService: WizardService,
    locationService: LocationsService,
    appBaseService: AppBaseService,
    computeState: ComputeRulesService,
    securityQuestionsService: SecurityQuestionsService,
    alertService: AlertService,
    router: Router
  ) {
    super(
      dialog,
      wizardService,
      locationService,
      appBaseService,
      computeState,
      securityQuestionsService,
      alertService,
      router
    );
  }
}
