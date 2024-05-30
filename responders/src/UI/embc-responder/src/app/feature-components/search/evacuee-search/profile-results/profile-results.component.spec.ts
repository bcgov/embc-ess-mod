import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  flushMicrotasks,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { computeInterfaceToken } from 'src/app/app.module';
import { CommunityType, EvacuationFileStatus, HouseholdMemberType, RegistrantStatus } from 'src/app/core/api/models';
import { RegistrantProfileSearchResultModel } from 'src/app/core/models/evacuee-search-results';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { MockEvacueeSearchService } from 'src/app/unit-tests/mockEvacueeSearch.service';
import { MockEvacueeSearchResultsService } from 'src/app/unit-tests/mockEvacueeSearchResults.service';
import { MockEvacueeSessionService } from 'src/app/unit-tests/mockEvacueeSession.service';
import { MockProfileSecurityQuestionsService } from 'src/app/unit-tests/mockProfileSecurityQuestions.service';
import { ProfileSecurityQuestionsService } from '../../profile-security-questions/profile-security-questions.service';
import { EvacueeSearchResultsService } from '../evacuee-search-results/evacuee-search-results.service';
import { EvacueeSearchService } from '../evacuee-search.service';

import { ProfileResultsComponent } from './profile-results.component';
import { provideRouter } from '@angular/router';

describe('ProfileResultsComponent', () => {
  let component: ProfileResultsComponent;
  let fixture: ComponentFixture<ProfileResultsComponent>;
  let evacueeSearchService;
  let evacueeSessionService;
  let profileSecurityQuestionsService;

  const mockProfileSearchResult: RegistrantProfileSearchResultModel = {
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
        taskId: '1234',
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
          country: { code: 'CA', name: 'Canada' }
        },
        createdOn: '2022-02-08T21:51:13Z',
        modifiedOn: '2022-02-23T18:21:51Z',
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
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, BrowserAnimationsModule, ProfileResultsComponent],
      providers: [
        ProfileResultsComponent,
        {
          provide: EvacueeSearchService,
          useClass: MockEvacueeSearchService
        },
        {
          provide: EvacueeSessionService,
          useClass: MockEvacueeSessionService
        },
        {
          provide: ProfileSecurityQuestionsService,
          useClass: MockProfileSecurityQuestionsService
        },
        {
          provide: EvacueeSearchResultsService,
          useClass: MockEvacueeSearchResultsService
        },
        { provide: computeInterfaceToken, useValue: {} },
        provideRouter([])
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileResultsComponent);
    component = fixture.componentInstance;
    evacueeSearchService = TestBed.inject(EvacueeSearchService);
    evacueeSessionService = TestBed.inject(EvacueeSessionService);
    profileSecurityQuestionsService = TestBed.inject(ProfileSecurityQuestionsService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should open access gate dialog ', () => {
    evacueeSessionService.isPaperBased = true;
    evacueeSearchService.evacueeSearchContext = {
      hasShownIdentification: false,
      evacueeSearchParameters: {
        firstName: 'Anne',
        lastName: 'Lee',
        dateOfBirth: '09/09/1999'
      }
    };
    fixture.detectChanges();
    component.openProfile(mockProfileSearchResult);
    fixture.detectChanges();

    const dialogContent = document.getElementsByTagName('app-access-reason-gate-dialog')[0] as HTMLElement;

    expect(dialogContent.textContent).toContain('Please specify the reason for accessing');
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
