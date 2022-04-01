import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EssFilesResultsComponent } from './ess-files-results.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { EvacueeSearchService } from '../evacuee-search.service';
import { MockEvacueeSearchService } from 'src/app/unit-tests/mockEvacueeSearch.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { MockEvacueeSessionService } from 'src/app/unit-tests/mockEvacueeSession.service';
import { EssFileSecurityPhraseService } from '../../essfile-security-phrase/essfile-security-phrase.service';
import { EvacueeSearchResultsService } from '../evacuee-search-results/evacuee-search-results.service';
import { MockEvacueeSearchResultsService } from 'src/app/unit-tests/mockEvacueeSearchResults.service';
import { MockEssFileSecurityPhraseService } from 'src/app/unit-tests/mockEssFileSecurityPhrase.service';
import { EvacuationFileSearchResultModel } from 'src/app/core/models/evacuee-search-results';
import {
  CommunityType,
  EvacuationFileStatus,
  HouseholdMemberType
} from 'src/app/core/api/models';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { EssfileDashboardComponent } from '../../essfile-dashboard/essfile-dashboard.component';
import { EssfileSecurityPhraseComponent } from '../../essfile-security-phrase/essfile-security-phrase.component';

describe('EssFilesResultsComponent', () => {
  let component: EssFilesResultsComponent;
  let fixture: ComponentFixture<EssFilesResultsComponent>;
  let evacueeSearchService;
  let evacueeSessionService;
  let essFileSecurityPhraseService;

  const mockPaperEssFileResult: EvacuationFileSearchResultModel = {
    id: '149927',
    externalReferenceId: 'T2000',
    isPaperBasedFile: true,
    isRestricted: false,
    taskId: 'test',
    taskStartDate: '2021-03-23T17:26:00Z',
    taskEndDate: '2022-04-14T15:00:00Z',
    evacuatedFrom: {
      community: {
        code: '6e69dfaf-9f97-ea11-b813-005056830319',
        name: '100 Mile House',
        districtName: 'Cariboo',
        stateProvinceCode: 'BC',
        countryCode: 'CAN',
        type: CommunityType.DistrictMunicipality
      },
      addressLine1: '123 Richmond St',
      addressLine2: null,
      city: null,
      communityCode: '6e69dfaf-9f97-ea11-b813-005056830319',
      stateProvinceCode: null,
      countryCode: null,
      postalCode: null,
      country: { code: 'CA', name: 'Canada' }
    },
    createdOn: '2022-02-16T20:55:58Z',
    modifiedOn: '2022-02-24T19:15:03Z',
    status: EvacuationFileStatus.Active,
    householdMembers: [
      {
        id: '7f96f2a1-2bf7-4466-8adb-49102eaedabf',
        firstName: 'anne',
        lastName: 'lee',
        isSearchMatch: true,
        type: HouseholdMemberType.Registrant,
        isMainApplicant: true,
        isRestricted: false
      }
    ]
  };

  const mockDigitalEssFileResult: EvacuationFileSearchResultModel = {
    id: '149927',
    externalReferenceId: null,
    isPaperBasedFile: false,
    isRestricted: false,
    taskId: 'test',
    taskStartDate: '2021-03-23T17:26:00Z',
    taskEndDate: '2022-04-14T15:00:00Z',
    evacuatedFrom: {
      community: {
        code: '6e69dfaf-9f97-ea11-b813-005056830319',
        name: '100 Mile House',
        districtName: 'Cariboo',
        stateProvinceCode: 'BC',
        countryCode: 'CAN',
        type: CommunityType.DistrictMunicipality
      },
      addressLine1: '123 Richmond St',
      addressLine2: null,
      city: null,
      communityCode: '6e69dfaf-9f97-ea11-b813-005056830319',
      stateProvinceCode: null,
      countryCode: null,
      postalCode: null,
      country: { code: 'CA', name: 'Canada' }
    },
    createdOn: '2022-02-16T20:55:58Z',
    modifiedOn: '2022-02-24T19:15:03Z',
    status: EvacuationFileStatus.Active,
    householdMembers: [
      {
        id: '7f96f2a1-2bf7-4466-8adb-49102eaedabf',
        firstName: 'anne',
        lastName: 'lee',
        isSearchMatch: true,
        type: HouseholdMemberType.Registrant,
        isMainApplicant: true,
        isRestricted: false
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EssFilesResultsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'responder-access/search/essfile-dashboard',
            component: EssfileDashboardComponent
          },
          {
            path: 'responder-access/search/security-phrase',
            component: EssfileSecurityPhraseComponent
          }
        ])
      ],
      providers: [
        EssFilesResultsComponent,
        {
          provide: EvacueeSearchService,
          useClass: MockEvacueeSearchService
        },
        {
          provide: EvacueeSessionService,
          useClass: MockEvacueeSessionService
        },
        {
          provide: EssFileSecurityPhraseService,
          useClass: MockEssFileSecurityPhraseService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssFilesResultsComponent);
    component = fixture.componentInstance;
    evacueeSearchService = TestBed.inject(EvacueeSearchService);
    evacueeSessionService = TestBed.inject(EvacueeSessionService);
    essFileSecurityPhraseService = TestBed.inject(EssFileSecurityPhraseService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should open unable access ESS file dialog', () => {
    evacueeSessionService.isPaperBased = true;
    evacueeSearchService.paperBasedEssFile = 'T123456';
    fixture.detectChanges();
    component.openESSFile(mockPaperEssFileResult);
    fixture.detectChanges();

    const dialogContent = document.getElementsByTagName(
      'app-information-dialog'
    )[0] as HTMLElement;

    expect(dialogContent.textContent).toEqual(
      'Responders doing data entry for a paper ESS File can only access ESS Files that match the paper ESS File number used during the search process.If you entered the incorrect paper ESS File Number, go back and start a new search with the correct details. Close '
    );
  });

  it('should navigate to ess file dashboard when paper based', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      evacueeSessionService.isPaperBased = true;
      evacueeSearchService.paperBasedEssFile = 'T2000';

      fixture.detectChanges();
      component.openESSFile(mockPaperEssFileResult);
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith([
        'responder-access/search/essfile-dashboard'
      ]);
    }
  ));

  it('should open unable access file dialog', () => {
    evacueeSessionService.isPaperBased = false;
    evacueeSearchService.evacueeSearchContext = {
      hasShownIdentification: false,
      evacueeSearchParameters: {
        firstName: 'Anne',
        lastName: 'Lee',
        dateOfBirth: '09/09/1999'
      }
    };
    fixture.detectChanges();
    component.openESSFile(mockPaperEssFileResult);
    fixture.detectChanges();

    const dialogContent = document.getElementsByTagName(
      'app-information-dialog'
    )[0] as HTMLElement;

    expect(dialogContent.textContent).toEqual(
      'This file can only be viewed if the evacuee presented govenment-issued identification. Close '
    );
  });

  it('should navigate to security phrase', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      evacueeSessionService.isPaperBased = false;
      evacueeSearchService.evacueeSearchContext = {
        hasShownIdentification: false,
        evacueeSearchParameters: {
          firstName: 'Anne',
          lastName: 'Lee',
          dateOfBirth: '09/09/1999'
        }
      };
      essFileSecurityPhraseService.securityQuestionsValue = {
        securityPhrase: 's****e'
      };

      fixture.detectChanges();
      component.openESSFile(mockDigitalEssFileResult);
      fixture.detectChanges();

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith([
          'responder-access/search/security-phrase'
        ]);
      }, 500);
    }
  ));

  it('should navigate to ess file dashboard when digital based', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      evacueeSessionService.isPaperBased = false;
      evacueeSearchService.evacueeSearchContext = {
        hasShownIdentification: true,
        evacueeSearchParameters: {
          firstName: 'Anne',
          lastName: 'Lee',
          dateOfBirth: '09/09/1999'
        }
      };

      fixture.detectChanges();
      component.openESSFile(mockDigitalEssFileResult);
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith([
        'responder-access/search/essfile-dashboard'
      ]);
    }
  ));
});
