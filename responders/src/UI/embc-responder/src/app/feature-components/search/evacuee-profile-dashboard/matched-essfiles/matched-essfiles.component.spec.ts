import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { computeInterfaceToken } from 'src/app/app.module';
import { MemberRole } from 'src/app/core/api/models';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { UserService } from 'src/app/core/services/user.service';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { MockEvacueeProfileService } from 'src/app/unit-tests/mockEvacueeProfile.service';
import { MockEvacueeSearchService } from 'src/app/unit-tests/mockEvacueeSearch.service';
import { MockEvacueeSessionService } from 'src/app/unit-tests/mockEvacueeSession.service';
import { MockUserService } from 'src/app/unit-tests/mockUser.service';
import { EvacueeSearchService } from '../../evacuee-search/evacuee-search.service';

import { MatchedEssfilesComponent } from './matched-essfiles.component';

describe('MatchedEssfilesComponent', () => {
  let component: MatchedEssfilesComponent;
  let fixture: ComponentFixture<MatchedEssfilesComponent>;
  let evacueeSearchService;
  let evacueeSessionService;
  let evacueeProfileService;
  let userService;

  const mockMatchedEssFiles = [
    {
      id: '127510',
      manualFileId: 'T2000',
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
        },
        {
          provide: UserService,
          useClass: MockUserService
        },
        { provide: computeInterfaceToken, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchedEssfilesComponent);
    component = fixture.componentInstance;
    evacueeSearchService = TestBed.inject(EvacueeSearchService);
    evacueeSessionService = TestBed.inject(EvacueeSessionService);
    evacueeProfileService = TestBed.inject(EvacueeProfileService);
    userService = TestBed.inject(UserService);
  });

  it('should get paperBased from service', () => {
    userService.currentProfileValue = {
      agreementSignDate: null,
      firstName: 'Test_First_Name',
      lastName: 'Test_Last_Name',
      requiredToSignAgreement: false,
      userName: 'Test_User',
      role: MemberRole.Tier2
    };
    evacueeSessionService.isPaperBased = false;
    evacueeProfileService.evacuationFileSummaryValue = mockMatchedEssFiles;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.isPaperBased).toEqual(false);
  });

  it('should get paperBased EssFile number from service', () => {
    userService.currentProfileValue = {
      agreementSignDate: null,
      firstName: 'Test_First_Name',
      lastName: 'Test_Last_Name',
      requiredToSignAgreement: false,
      userName: 'Test_User',
      role: MemberRole.Tier2
    };
    evacueeProfileService.evacuationFileSummaryValue = mockMatchedEssFiles;
    evacueeSessionService.isPaperBased = true;
    evacueeSearchService.evacueeSearchContext = {
      evacueeSearchParameters: { paperFileNumber: 'T2000' }
    };
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.paperBasedEssFile).toEqual('T2000');
  });

  it('should get matches ess files from service', () => {
    evacueeSessionService.isPaperBased = true;
    evacueeSearchService.evacueeSearchContext = {
      evacueeSearchParameters: { paperFileNumber: 'T2000' }
    };
    userService.currentProfileValue = {
      agreementSignDate: null,
      firstName: 'Test_First_Name',
      lastName: 'Test_Last_Name',
      requiredToSignAgreement: false,
      userName: 'Test_User',
      role: MemberRole.Tier2
    };
    evacueeProfileService.evacuationFileSummaryValue = mockMatchedEssFiles;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.essFiles).toEqual(
      evacueeProfileService.evacuationFileSummaryValue
    );
  });
});
