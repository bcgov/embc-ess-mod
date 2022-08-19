import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { CommunityType } from '../core/api/models';
import { RegistrantProfileModel } from '../core/models/registrant-profile.model';
import { ComputeRulesService } from '../core/services/computeRules.service';
import { CustomValidationService } from '../core/services/customValidation.service';
import { EssFileService } from '../core/services/ess-file.service';
import { EvacueeProfileService } from '../core/services/evacuee-profile.service';
import { AppBaseService } from '../core/services/helper/appBase.service';
import { SearchDataService } from '../core/services/helper/search-data.service';
import { MockAlertService } from './mockAlert.service';
import { MockEvacueeSearchService } from './mockEvacueeSearch.service';

@Injectable({
  providedIn: 'root'
})
export class MockDashboardService extends SearchDataService {
  public mockProfile: RegistrantProfileModel = {
    id: 'abc',
    createdOn: '2022-02-08T21:50:38Z',
    modifiedOn: '2022-02-08T22:50:09Z',
    restriction: false,
    personalDetails: {
      firstName: 'julia',
      lastName: 'roberts',
      initials: null,
      preferredName: null,
      gender: 'Female',
      dateOfBirth: '12/12/2000'
    },
    contactDetails: {
      email: null,
      phone: '999-999-9999'
    },
    primaryAddress: {
      community: {
        code: '9069dfaf-9f97-ea11-b813-005056830319',
        name: 'Chetwynd',
        districtName: 'Peace River',
        stateProvinceCode: 'BC',
        countryCode: 'CAN',
        type: CommunityType.DistrictMunicipality
      },
      country: {
        code: 'CAN',
        name: 'Canada'
      },
      stateProvince: {
        code: 'BC',
        name: 'British Columbia',
        countryCode: 'CAN'
      },
      addressLine1: '890 Dolphin St',
      addressLine2: null,
      city: null,
      communityCode: '9069dfaf-9f97-ea11-b813-005056830319',
      stateProvinceCode: 'BC',
      countryCode: 'CAN',
      postalCode: null
    },
    mailingAddress: {
      community: {
        code: '9069dfaf-9f97-ea11-b813-005056830319',
        name: 'Chetwynd',
        districtName: 'Peace River',
        stateProvinceCode: 'BC',
        countryCode: 'CAN',
        type: CommunityType.DistrictMunicipality
      },
      country: {
        code: 'CAN',
        name: 'Canada'
      },
      stateProvince: {
        code: 'BC',
        name: 'British Columbia',
        countryCode: 'CAN'
      },
      addressLine1: '890 Dolphin St',
      addressLine2: null,
      city: null,
      communityCode: '9069dfaf-9f97-ea11-b813-005056830319',
      stateProvinceCode: 'BC',
      countryCode: 'CAN',
      postalCode: null
    },
    isMailingAddressSameAsPrimaryAddress: true,
    securityQuestions: [
      {
        id: 1,
        question: 'What was the name of your first pet?',
        answer: 't*****t',
        answerChanged: false
      },
      {
        id: 2,
        question:
          'What was your first car’s make and model? (e.g. Ford Taurus)',
        answer: 't*****t',
        answerChanged: false
      },
      {
        id: 3,
        question: 'Where was your first job?',
        answer: 't*****t',
        answerChanged: false
      }
    ],
    authenticatedUser: false,
    verifiedUser: true
  };

  public mockPaperProfile: RegistrantProfileModel = {
    id: 'bcd',
    createdOn: '2022-02-08T21:50:38Z',
    modifiedOn: '2022-02-08T22:50:09Z',
    restriction: false,
    personalDetails: {
      firstName: 'julia',
      lastName: 'roberts',
      initials: null,
      preferredName: null,
      gender: 'Female',
      dateOfBirth: '12/12/2000'
    },
    contactDetails: {
      email: null,
      phone: '999-999-9999'
    },
    primaryAddress: {
      community: {
        code: '9069dfaf-9f97-ea11-b813-005056830319',
        name: 'Chetwynd',
        districtName: 'Peace River',
        stateProvinceCode: 'BC',
        countryCode: 'CAN',
        type: CommunityType.DistrictMunicipality
      },
      country: {
        code: 'CAN',
        name: 'Canada'
      },
      stateProvince: {
        code: 'BC',
        name: 'British Columbia',
        countryCode: 'CAN'
      },
      addressLine1: '890 Dolphin St',
      addressLine2: null,
      city: null,
      communityCode: '9069dfaf-9f97-ea11-b813-005056830319',
      stateProvinceCode: 'BC',
      countryCode: 'CAN',
      postalCode: null
    },
    mailingAddress: {
      community: {
        code: '9069dfaf-9f97-ea11-b813-005056830319',
        name: 'Chetwynd',
        districtName: 'Peace River',
        stateProvinceCode: 'BC',
        countryCode: 'CAN',
        type: CommunityType.DistrictMunicipality
      },
      country: {
        code: 'CAN',
        name: 'Canada'
      },
      stateProvince: {
        code: 'BC',
        name: 'British Columbia',
        countryCode: 'CAN'
      },
      addressLine1: '890 Dolphin St',
      addressLine2: null,
      city: null,
      communityCode: '9069dfaf-9f97-ea11-b813-005056830319',
      stateProvinceCode: 'BC',
      countryCode: 'CAN',
      postalCode: null
    },
    isMailingAddressSameAsPrimaryAddress: true,
    securityQuestions: [],
    authenticatedUser: false,
    verifiedUser: true
  };

  constructor(
    customValidation: CustomValidationService,
    appBaseService: AppBaseService,
    computeState: ComputeRulesService,
    evacueeProfileService: EvacueeProfileService,
    alertService: MockAlertService,
    essFileService: EssFileService,
    evacueeSearchService: MockEvacueeSearchService
  ) {
    super(
      customValidation,
      appBaseService,
      computeState,
      evacueeProfileService,
      alertService,
      essFileService,
      evacueeSearchService
    );
  }

  async getEvacueeProfile(
    evacueeProfileId: string
  ): Promise<RegistrantProfileModel> {
    const profile$ =
      evacueeProfileId === 'abc' ? this.mockProfile : this.mockPaperProfile;
    return profile$;
  }
}
