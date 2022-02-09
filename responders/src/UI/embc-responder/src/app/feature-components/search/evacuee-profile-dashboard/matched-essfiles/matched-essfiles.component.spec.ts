import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { MockEvacueeProfileService } from 'src/app/unit-tests/mockEvacueeProfile.service';
import { MockEvacueeSearchService } from 'src/app/unit-tests/mockEvacueeSearch.service';
import { MockEvacueeSessionService } from 'src/app/unit-tests/mockEvacueeSession.service';
import { EvacueeSearchService } from '../../evacuee-search/evacuee-search.service';

import { MatchedEssfilesComponent } from './matched-essfiles.component';

describe('MatchedEssfilesComponent', () => {
  let component: MatchedEssfilesComponent;
  let fixture: ComponentFixture<MatchedEssfilesComponent>;
  let evacueeSearchService;
  let evacueeSessionService;
  let evacueeProfileService;

  const mockMatchedEssFiles = [
    {
      id: '127510',
      externalReferenceId: null,
      status: 'Pending',
      task: {
        taskNumber: null,
        communityCode: null,
        from: '0001-01-01T00:00:00',
        to: '0001-01-01T00:00:00'
      },
      createdOn: '2022-02-08T21:51:13Z',
      issuedOn: '2022-02-08T21:51:13Z',
      evacuationFileDate: '2022-02-08T21:51:00Z',
      evacuatedFromAddress: {
        community: {
          code: '9069dfaf-9f97-ea11-b813-005056830319',
          name: 'Chetwynd',
          districtName: 'Peace River',
          stateProvinceCode: 'BC',
          countryCode: 'CAN',
          type: 'DistrictMunicipality'
        },
        addressLine1: '890 Dolphin St',
        addressLine2: null,
        city: null,
        communityCode: '9069dfaf-9f97-ea11-b813-005056830319',
        stateProvinceCode: null,
        countryCode: null,
        postalCode: null
      },
      isRestricted: false,
      isPaper: false,
      isPerliminary: false
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatchedEssfilesComponent],
      imports: [
        MatDialogModule,
        RouterTestingModule,
        HttpClientTestingModule,
        CustomPipeModule
      ],
      providers: [
        MatchedEssfilesComponent,
        {
          provide: EvacueeSearchService,
          useClass: MockEvacueeSearchService
        },
        {
          provide: EvacueeSessionService,
          useClass: MockEvacueeSessionService
        },
        {
          provide: EvacueeProfileService,
          useClass: MockEvacueeProfileService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchedEssfilesComponent);
    component = fixture.componentInstance;
    evacueeSearchService = TestBed.inject(EvacueeSearchService);
    evacueeSessionService = TestBed.inject(EvacueeSessionService);
    evacueeProfileService = TestBed.inject(EvacueeProfileService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get profileId from service', () => {
    evacueeSessionService.isPaperBased = false;
    evacueeSessionService.profileId = 'a7b76c4b-256b-4385-b35e-7b496e70f172';
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.registrantId).toEqual(
      'a7b76c4b-256b-4385-b35e-7b496e70f172'
    );
  });

  it('should get paperBased from service', () => {
    evacueeSessionService.isPaperBased = false;
    evacueeSessionService.profileId = 'a7b76c4b-256b-4385-b35e-7b496e70f172';
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.isPaperBased).toEqual(false);
  });

  it('should get paperBased EssFile number from service', () => {
    evacueeSessionService.isPaperBased = true;
    evacueeSessionService.profileId = 'a7b76c4b-256b-4385-b35e-7b496e70f172';
    evacueeSearchService.paperBasedEssFile = 'T2000';
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.paperBasedEssFile).toEqual('T2000');
  });

  it('should get matches ess files from service', () => {
    // evacueeSessionService.isPaperBased = true;
    // evacueeSessionService.profileId = 'a7b76c4b-256b-4385-b35e-7b496e70f172';
    // evacueeSearchService.paperBasedEssFile = 'T2000';
    evacueeProfileService.evacuationFileSummaryValue = mockMatchedEssFiles;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.essFiles).toEqual(
      evacueeProfileService.evacuationFileSummaryValue
    );
  });
});
