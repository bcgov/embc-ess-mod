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

import { EvacueeSearchResultsComponent } from './evacuee-search-results.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { WizardComponent } from 'src/app/feature-components/wizard/wizard.component';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { EvacueeSearchService } from '../evacuee-search.service';
import { MockEvacueeSessionService } from 'src/app/unit-tests/mockEvacueeSession.service';
import { MockEvacueeSearchService } from 'src/app/unit-tests/mockEvacueeSearch.service';
import { Router } from '@angular/router';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { EvacueeSearchResultsService } from './evacuee-search-results.service';
import { MockEvacueeSearchResultsService } from 'src/app/unit-tests/mockEvacueeSearchResults.service';
import { EvacueeSearchResults } from 'src/app/core/models/evacuee-search-results';
import {
  CommunityType,
  EvacuationFileStatus,
  HouseholdMemberType,
  RegistrantStatus
} from 'src/app/core/api/models';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { MockEvacueeProfileService } from 'src/app/unit-tests/mockEvacueeProfile.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { computeInterfaceToken } from 'src/app/app.module';

describe('EvacueeSearchResultsComponent', () => {
  let component: EvacueeSearchResultsComponent;
  let fixture: ComponentFixture<EvacueeSearchResultsComponent>;
  let evacueeSessionService;
  let evacueeSearchService;
  let evacueeSearchResultsService;
  let evacueeProfileService;

  const mockEvacueeSearchResult: EvacueeSearchResults = {
    files: [
      {
        id: '127509',
        externalReferenceId: 'T2000',
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
            externalReferenceId: null,
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvacueeSearchResultsComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'wizard', component: WizardComponent }
        ])
      ],
      providers: [
        EvacueeSearchResultsComponent,
        { provide: EvacueeSessionService, useClass: MockEvacueeSessionService },
        { provide: EvacueeSearchService, useClass: MockEvacueeSearchService },
        {
          provide: EvacueeSearchResultsService,
          useClass: MockEvacueeSearchResultsService
        },
        {
          provide: EvacueeProfileService,
          useClass: MockEvacueeProfileService
        },
        { provide: computeInterfaceToken, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacueeSearchResultsComponent);
    component = fixture.componentInstance;
    evacueeSessionService = TestBed.inject(EvacueeSessionService);
    evacueeSearchService = TestBed.inject(EvacueeSearchService);
    evacueeSearchResultsService = TestBed.inject(EvacueeSearchResultsService);
    evacueeProfileService = TestBed.inject(EvacueeProfileService);

    const evacueeSearchDetails = {
      firstName: 'Evac',
      lastName: 'Five',
      dateOfBirth: '12/12/2000'
    };
    evacueeSearchService.evacueeSearchContext = {
      hasShownIdentification: true,
      evacueeSearchParameters: evacueeSearchDetails
    };
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get paper based true from service', () => {
    evacueeSearchResultsService.evacueeSearchResultsValue =
      mockEvacueeSearchResult;
    evacueeSessionService.isPaperBased = true;
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.isPaperBased).toEqual(true);
  });

  it('should get paper based false from service', () => {
    evacueeSessionService.isPaperBased = false;
    evacueeSearchResultsService.evacueeSearchResultsValue =
      mockEvacueeSearchResult;
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.isPaperBased).toEqual(false);
  });

  it('should appear paper based search results title', fakeAsync(() => {
    evacueeSessionService.isPaperBased = true;
    evacueeSearchService.paperBasedEssFile = 'T123456';
    evacueeSearchResultsService.evacueeSearchResultsValue =
      mockEvacueeSearchResult;
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const titleElem = nativeElem.querySelector('.result-text');

    expect(titleElem.textContent).toEqual(
      ' Results for "FIVE, Evac" with a date of birth "12-Dec-2000" and a paper ESS File # T123456.'
    );
  }));

  it('should appear digital based search results title', fakeAsync(() => {
    evacueeSessionService.isPaperBased = false;
    evacueeSearchResultsService.evacueeSearchResultsValue =
      mockEvacueeSearchResult;
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const titleElem = nativeElem.querySelector('.result-text');

    expect(titleElem.textContent).toEqual(
      ' Results for "FIVE, Evac" with a date of birth "12-Dec-2000".'
    );
  }));

  it('should get search profile results from service', () => {
    evacueeSearchResultsService.evacueeSearchResultsValue =
      mockEvacueeSearchResult;
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.registrantResults).toEqual(
      evacueeSearchResultsService.evacueeSearchResultsValue.registrants
    );
  });

  it('should get search ess files results from service', () => {
    evacueeSearchResultsService.evacueeSearchResultsValue =
      mockEvacueeSearchResult;
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.fileResults).toEqual(
      evacueeSearchResultsService.evacueeSearchResultsValue.files
    );
  });

  it('should navigate to Wizard', inject([Router], (router: Router) => {
    spyOn(router, 'navigate').and.stub();

    evacueeSearchResultsService.evacueeSearchResultsValue =
      mockEvacueeSearchResult;

    fixture.detectChanges();
    component.ngOnInit();
    component.openWizard();

    expect(router.navigate).toHaveBeenCalledWith(['/ess-wizard'], {
      queryParams: { type: WizardType.NewRegistration },
      queryParamsHandling: 'merge'
    });
  }));

  it('should open dialog paper based ESS File already exists', () => {
    evacueeSessionService.isPaperBased = true;
    evacueeSessionService.profileId = 'a7b76c4b-256b-4385-b35e-7b496e70f172';
    evacueeSearchService.paperBasedEssFile = 'T3333';
    evacueeProfileService.evacuationFileSummaryValue = [
      {
        id: '122552',
        externalReferenceId: 'T3333',
        status: 'Completed',
        task: {
          taskNumber: '0001',
          communityCode: '7e69dfaf-9f97-ea11-b813-005056830319',
          from: '2021-03-17T21:32:00Z',
          to: '2021-07-06T18:19:00Z'
        },
        createdOn: '2022-02-01T18:05:37Z',
        issuedOn: '2022-02-01T18:05:37Z',
        evacuationFileDate: '2022-02-01T18:05:35Z',
        evacuatedFromAddress: {
          community: {
            code: '6e69dfaf-9f97-ea11-b813-005056830319',
            name: '100 Mile House',
            districtName: 'Cariboo',
            stateProvinceCode: 'BC',
            countryCode: 'CAN',
            type: 'DistrictMunicipality'
          },
          addressLine1: '123 Richmond St',
          addressLine2: null,
          city: null,
          communityCode: '6e69dfaf-9f97-ea11-b813-005056830319',
          stateProvinceCode: null,
          countryCode: null,
          postalCode: null
        },
        isRestricted: false,
        isPaper: true,
        isPerliminary: false
      }
    ];
    fixture.detectChanges();
    component.ngOnInit();
    component.openWizard();
    fixture.detectChanges();

    const dialogContent = document.getElementsByTagName(
      'app-ess-file-exists'
    )[0] as HTMLElement;
    expect(dialogContent.textContent).toEqual(
      ' ESS File # T3333 already exists in the ERA Tool. Please continue to that ESS File to proceed with paper-based entry. Speak to your supervisor if no results are displaying and you are still seeing this message, as the file might be restricted. Alternatively, go back and search again. Close '
    );
  });
});
