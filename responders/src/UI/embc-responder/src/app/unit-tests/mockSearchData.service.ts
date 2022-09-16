import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import {
  CommunityType,
  EvacuationFileStatus,
  HouseholdMemberType,
  RegistrantStatus
} from '../core/api/models';
import { EvacueeDetailsModel } from '../core/models/evacuee-search-context.model';
import { EvacueeSearchResults } from '../core/models/evacuee-search-results';
import { ComputeRulesService } from '../core/services/computeRules.service';
import { CustomValidationService } from '../core/services/customValidation.service';
import { EssFileService } from '../core/services/ess-file.service';
import { EvacueeProfileService } from '../core/services/evacuee-profile.service';
import { AppBaseService } from '../core/services/helper/appBase.service';
import { MockAlertService } from './mockAlert.service';
import { MockDashboardService } from './mockDashboard.service';
import { MockEvacueeSearchService } from './mockEvacueeSearch.service';

@Injectable({ providedIn: 'root' })
export class MockSearchDataService extends MockDashboardService {
  public mockEvacueeSearchResult: EvacueeSearchResults = {
    files: [
      {
        id: '127509',
        manualFileId: 'T2000',
        isPaperBasedFile: true,
        isRestricted: false,
        taskId: null,
        taskStartDate: null,
        taskEndDate: null,
        evacuatedFrom: {
          community: {
            code: '7669dfaf-9f97-ea11-b813-005056830319',
            name: 'Armstrong',
            districtName: 'North Okanagan',
            stateProvinceCode: 'BC',
            countryCode: 'CAN',
            type: CommunityType.City
          },
          addressLine1: '123 Main St',
          addressLine2: null,
          city: null,
          communityCode: '7669dfaf-9f97-ea11-b813-005056830319',
          stateProvinceCode: null,
          countryCode: null,
          postalCode: null,
          country: {
            code: 'CAN',
            name: 'Canada'
          }
        },
        createdOn: '2022-02-08T21:46:26Z',
        modifiedOn: '2022-02-08T22:57:29Z',
        status: EvacuationFileStatus.Active,
        householdMembers: [
          {
            id: '73ca398d-75ad-484c-b5a1-579b70c8f6d0',
            firstName: 'Julia',
            lastName: 'Roberts',
            isSearchMatch: true,
            type: HouseholdMemberType.Registrant,
            isMainApplicant: true,
            isRestricted: false
          }
        ]
      }
    ],
    registrants: [
      {
        id: 'a7b76c4b-256b-4385-b35e-7b496e70f172',
        isRestricted: false,
        firstName: 'julia',
        lastName: 'roberts',
        status: RegistrantStatus.Verified,
        createdOn: '2022-02-08T21:50:38Z',
        modifiedOn: '2022-02-08T22:50:09Z',
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
          addressLine1: '890 Dolphin St',
          addressLine2: null,
          city: null,
          communityCode: '9069dfaf-9f97-ea11-b813-005056830319',
          stateProvinceCode: 'BC',
          countryCode: 'CAN',
          postalCode: null
        },
        evacuationFiles: [
          {
            id: '127510',
            manualFileId: null,
            isPaperBasedFile: false,
            isRestricted: false,
            taskId: null,
            taskStartDate: null,
            taskEndDate: null,
            evacuatedFrom: {
              community: {
                code: '9069dfaf-9f97-ea11-b813-005056830319',
                name: 'Chetwynd',
                districtName: 'Peace River',
                stateProvinceCode: 'BC',
                countryCode: 'CAN',
                type: CommunityType.DistrictMunicipality
              },
              addressLine1: '890 Dolphin St',
              addressLine2: null,
              city: null,
              communityCode: '9069dfaf-9f97-ea11-b813-005056830319',
              stateProvinceCode: null,
              countryCode: null,
              postalCode: null,
              country: {
                code: 'CAN',
                name: 'Canada'
              }
            },
            createdOn: '2022-02-08T21:51:13Z',
            modifiedOn: '2022-02-08T22:56:48Z',
            status: EvacuationFileStatus.Active,
            householdMembers: [
              {
                id: 'acdf1191-75b5-462b-97a8-d4338e236dee',
                firstName: 'julia',
                lastName: 'roberts',
                isSearchMatch: false,
                type: HouseholdMemberType.Registrant,
                isMainApplicant: true,
                isRestricted: false
              }
            ]
          }
        ]
      }
    ]
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

  public evacueeSearch(
    evacueeSearchContext: EvacueeDetailsModel
  ): Promise<EvacueeSearchResults> {
    const $result = new BehaviorSubject<EvacueeSearchResults>(
      this.mockEvacueeSearchResult
    );
    return lastValueFrom($result);
  }

  async checkForPaperFile(wizardType: string): Promise<string> {
    if (
      this.evacueeSearchService.evacueeSearchContext.evacueeSearchParameters
        .paperFileNumber === 'T100'
    ) {
      return null;
    } else {
      return '/ess-wizard';
    }
  }
}
