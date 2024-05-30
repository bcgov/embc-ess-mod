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
import { CommunityType, EvacuationFileStatus, HouseholdMemberType } from 'src/app/core/api/models';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { EssfileDashboardComponent } from '../../essfile-dashboard/essfile-dashboard.component';
import { EssfileSecurityPhraseComponent } from '../../essfile-security-phrase/essfile-security-phrase.component';
import { computeInterfaceToken } from 'src/app/app.module';
import { EssFilesResultsService } from './ess-files-results.service';
import { MockEssFilesResultsService } from 'src/app/unit-tests/mockEssFileResults.service';
import { provideRouter } from '@angular/router';

describe('EssFilesResultsComponent', () => {
  let component: EssFilesResultsComponent;
  let fixture: ComponentFixture<EssFilesResultsComponent>;
  let evacueeSearchService;
  let evacueeSessionService;
  let essFileSecurityPhraseService;
  let essResultsService;

  const mockPaperEssFileResult: EvacuationFileSearchResultModel = {
    id: '149927',
    manualFileId: 'T2000',
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
    manualFileId: null,
    isPaperBasedFile: false,
    isRestricted: false,
    isFileCompleted: true,
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
      imports: [HttpClientTestingModule, MatDialogModule, BrowserAnimationsModule, EssFilesResultsComponent],
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
        },
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: EssFilesResultsService,
          useClass: MockEssFilesResultsService
        },
        provideRouter([])
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssFilesResultsComponent);
    component = fixture.componentInstance;
    evacueeSearchService = TestBed.inject(EvacueeSearchService);
    evacueeSessionService = TestBed.inject(EvacueeSessionService);
    essFileSecurityPhraseService = TestBed.inject(EssFileSecurityPhraseService);
    essResultsService = TestBed.inject(EssFilesResultsService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should  open access gate dialog ', fakeAsync(() => {
    evacueeSessionService.isPaperBased = true;
    evacueeSearchService.evacueeSearchContext = {
      hasShownIdentification: true,
      evacueeSearchParameters: {
        firstName: 'Evac',
        lastName: 'Five',
        dateOfBirth: '12/12/2000',
        paperFileNumber: 'T123456'
      }
    };
    fixture.detectChanges();
    component.openESSFile(mockPaperEssFileResult);

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();
    fixture.detectChanges();
    const dialogContent = document.getElementsByTagName('app-access-reason-gate-dialog')[0] as HTMLElement;

    expect(dialogContent).toBeTruthy();
  }));
});
