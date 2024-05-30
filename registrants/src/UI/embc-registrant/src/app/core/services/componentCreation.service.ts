import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComponentMetaDataModel } from '../model/componentMetaData.model';

export enum NeedsAssessmentSteps {
  EvacAddress = 'evac-address',
  FamilyAndPetsInformation = 'family-information-pets',
  IdentifyNeeds = 'identify-needs',
  Secret = 'secret'
}

@Injectable({ providedIn: 'root' })
export class ComponentCreationService {
  dynamicComponents: any = [
    { type: 'personal-details' },
    { type: 'address' },
    { type: 'contact-info' },
    { type: 'secret' }
  ];
  profileComponents: Array<any> = [
    {
      component: 'personal-details',
      nextButtonLabel: 'Next - Primary & Mailing Address',
      backButtonLabel: 'Go Back & Edit',
      isLast: false,
      loadWrapperButton: false,
      lastStep: -2,
      stepName: 'Personal Details'
    },
    {
      component: 'address',
      nextButtonLabel: 'Next - Contact Information',
      backButtonLabel: 'Go Back & Edit',
      isLast: false,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Address'
    },
    {
      component: 'contact-info',
      nextButtonLabel: 'Next - Security Question',
      backButtonLabel: 'Go Back & Edit',
      isLast: false,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Contact'
    },
    {
      component: 'security-questions',
      nextButtonLabel: 'Next - Create Evacuation File',
      backButtonLabel: 'Go Back & Edit',
      isLast: true,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Security Questions'
    }
  ];

  needsAssessmentComponents: Array<any> = [
    {
      component: NeedsAssessmentSteps.EvacAddress,
      nextButtonLabel: 'Next - Household Information',
      backButtonLabel: 'Cancel & Go Back to My Profile',
      isLast: false,
      loadWrapperButton: false,
      lastStep: -1,
      stepName: 'Location'
    },
    {
      component: NeedsAssessmentSteps.FamilyAndPetsInformation,
      nextButtonLabel: 'Next - Identify Needs',
      backButtonLabel: 'Go Back & Edit',
      isLast: false,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Household & Pets'
    },
    {
      component: NeedsAssessmentSteps.IdentifyNeeds,
      nextButtonLabel: 'Next - Security Word',
      backButtonLabel: 'Go Back & Edit',
      isLast: false,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Needs'
    },
    {
      component: NeedsAssessmentSteps.Secret,
      nextButtonLabel: 'Next - Review Submission',
      backButtonLabel: 'Go Back & Edit',
      isLast: false,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Security Word'
    }
  ];

  getProfileComponents(): Observable<any> {
    const profile = new Observable((observer) => {
      observer.next(this.dynamicComponents);
      observer.complete();
    });
    return profile;
  }

  createProfileSteps(): Array<ComponentMetaDataModel> {
    const componentArr: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
    for (const comp of this.profileComponents) {
      componentArr.push(Object.assign(new ComponentMetaDataModel(), comp));
    }
    return componentArr;
  }

  createEvacSteps(): Array<ComponentMetaDataModel> {
    const componentArr: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
    for (const comp of this.needsAssessmentComponents) {
      componentArr.push(Object.assign(new ComponentMetaDataModel(), comp));
    }
    return componentArr;
  }
}
