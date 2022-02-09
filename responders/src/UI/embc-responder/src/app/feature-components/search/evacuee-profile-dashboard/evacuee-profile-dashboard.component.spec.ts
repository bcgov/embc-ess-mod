import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { EvacueeProfileDashboardComponent } from './evacuee-profile-dashboard.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { EvacueeSearchService } from '../evacuee-search/evacuee-search.service';
import { MockEvacueeSearchService } from 'src/app/unit-tests/mockEvacueeSearch.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { MockEvacueeSessionService } from 'src/app/unit-tests/mockEvacueeSession.service';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { MockEvacueeProfileService } from 'src/app/unit-tests/mockEvacueeProfile.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';
import { CommunityType } from 'src/app/core/api/models';
import { WizardComponent } from '../../wizard/wizard.component';
import { Router } from '@angular/router';
import { WizardType } from 'src/app/core/models/wizard-type.model';

describe('EvacueeProfileDashboardComponent', () => {
  let component: EvacueeProfileDashboardComponent;
  let fixture: ComponentFixture<EvacueeProfileDashboardComponent>;
  let evacueeSearchService;
  let evacueeSessionService;
  let evacueeProfileService;

  const mockProfile: RegistrantProfileModel = {
    id: 'a7b76c4b-256b-4385-b35e-7b496e70f172',
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        RouterTestingModule,
        HttpClientTestingModule,
        CustomPipeModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'ess-wizard',
            component: WizardComponent
          }
        ])
      ],
      declarations: [EvacueeProfileDashboardComponent],
      providers: [
        EvacueeProfileDashboardComponent,
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
    fixture = TestBed.createComponent(EvacueeProfileDashboardComponent);
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
    evacueeSessionService.fileLinkStatus = 'S';
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.evacueeProfileId).toEqual(
      'a7b76c4b-256b-4385-b35e-7b496e70f172'
    );
  });

  it('should get paperBased from service', () => {
    evacueeSessionService.isPaperBased = false;
    evacueeSessionService.profileId = 'a7b76c4b-256b-4385-b35e-7b496e70f172';
    evacueeSessionService.fileLinkStatus = 'S';
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.isPaperBased).toEqual(false);
  });

  it('should get paperBased EssFile number from service', () => {
    evacueeSessionService.isPaperBased = true;
    evacueeSessionService.profileId = 'a7b76c4b-256b-4385-b35e-7b496e70f172';
    evacueeSearchService.paperBasedEssFile = 'T2000';
    evacueeSessionService.fileLinkStatus = 'S';
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.paperBasedEssFile).toEqual('T2000');
  });

  it('should get evacuee profile from service', () => {
    evacueeSessionService.isPaperBased = true;
    evacueeSessionService.profileId = 'a7b76c4b-256b-4385-b35e-7b496e70f172';
    evacueeSearchService.paperBasedEssFile = 'T2000';
    evacueeSessionService.fileLinkStatus = 'S';
    evacueeProfileService.registrantProfileValue = mockProfile;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.evacueeProfile).toEqual(mockProfile);
  });

  it('should navigate to New ESS File Wizard', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      evacueeSessionService.isPaperBased = true;
      evacueeProfileService.evacuationFileSummaryValue = [];

      fixture.detectChanges();
      component.ngOnInit();
      component.createNewESSFile();
      expect(router.navigate).toHaveBeenCalledWith(['/ess-wizard'], {
        queryParams: { type: WizardType.NewEssFile },
        queryParamsHandling: 'merge'
      });
    }
  ));

  it('should navigate to Edit Profile Wizard', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();

      fixture.detectChanges();
      component.ngOnInit();
      component.editProfile();
      expect(router.navigate).toHaveBeenCalledWith(['/ess-wizard'], {
        queryParams: { type: WizardType.EditRegistration },
        queryParamsHandling: 'merge'
      });
    }
  ));
});
