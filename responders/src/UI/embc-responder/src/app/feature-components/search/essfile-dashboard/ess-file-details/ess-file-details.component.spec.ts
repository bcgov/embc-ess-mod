import { ComponentFixture, inject, TestBed, tick } from '@angular/core/testing';

import { EssFileDetailsComponent } from './ess-file-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockEssfileDashboardService } from 'src/app/unit-tests/mockEssfileDashboard.service';
import { EssfileDashboardService } from '../essfile-dashboard.service';
import { NavigationStart, Router } from '@angular/router';
import { of } from 'rxjs';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import {
  CommunityType,
  EvacuationFileStatus,
  HouseholdMemberType,
  InsuranceOption,
  NeedsAssessmentType
} from 'src/app/core/api/models';
import { MatDialogModule } from '@angular/material/dialog';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { MockOptionInjectionService } from 'src/app/unit-tests/mockOptionInjection.service';
import { ReactiveFormsModule } from '@angular/forms';
import { computeInterfaceToken } from 'src/app/app.module';

describe('EssFileDetailsComponent', () => {
  let component: EssFileDetailsComponent;
  let fixture: ComponentFixture<EssFileDetailsComponent>;
  let essfileDashboardService;
  let mockEssfileState: { file: EvacuationFileModel };
  const mockEssfile = {
    id: '102431',
    manualFileId: null,
    primaryRegistrantId: 'a677e7e1-54ea-48ef-a030-b48c56fccd9c',
    primaryRegistrantFirstName: 'Anne',
    primaryRegistrantLastName: 'Lee',
    evacuatedFromAddress: {
      community: {
        code: '7669dfaf-9f97-ea11-b813-005056830319',
        name: 'Armstrong',
        districtName: 'North Okanagan',
        stateProvinceCode: 'BC',
        countryCode: 'CAN',
        type: CommunityType.City
      },
      addressLine1: '123 Air St',
      addressLine2: '099',
      city: null,
      communityCode: '7669dfaf-9f97-ea11-b813-005056830319',
      stateProvinceCode: null,
      countryCode: null,
      postalCode: 'V0J 2F8',
      country: {
        code: 'CAN',
        name: 'Canada'
      }
    },
    registrationLocation: 'facility',
    needsAssessment: {
      id: '14eda32d-fe43-4c85-ae64-3b41fe737adb',
      createdOn: '2022-02-02T17:38:05Z',
      modifiedOn: '2022-02-02T17:38:05Z',
      reviewingTeamMemberId: '8d955446-de73-ec11-b830-00505683fbf4',
      reviewingTeamMemberDisplayName: 'ESS D.',
      insurance: InsuranceOption.Unsure,
      evacuationImpact: 'evac',
      evacuationExternalReferrals: null,
      petCarePlans: null,
      houseHoldRecoveryPlan: null,
      recommendedReferralServices: [],
      householdMembers: [
        {
          id: '42ab5087-ce1c-48ec-b339-1b1c173842d7',
          linkedRegistrantId: 'a677e7e1-54ea-48ef-a030-b48c56fccd9c',
          firstName: 'Anne',
          lastName: 'Lee',
          initials: null,
          gender: 'Female',
          dateOfBirth: '09/09/1999',
          type: HouseholdMemberType.Registrant,
          isPrimaryRegistrant: true,
          isHouseholdMember: false,
          isMinor: false,
          isRestricted: false,
          isVerified: true
        },
        {
          id: 'c0350e7e-055b-45c9-b32d-1c81c14afdd5',
          linkedRegistrantId: null,
          firstName: 'abcd',
          lastName:
            'erfehrbfjherbfjhrebfjherhbfnceujkrsdhcnqeukasjdcnesjka,dnukasj,dmwehnfurgfyrgfgerhfjdvfdhjvbfdjhbvhd',
          initials: null,
          gender: 'Female',
          dateOfBirth: '09/09/1999',
          type: HouseholdMemberType.HouseholdMember,
          isPrimaryRegistrant: false,
          isHouseholdMember: true,
          isMinor: false,
          isRestricted: null,
          isVerified: null
        }
      ],
      haveSpecialDiet: false,
      specialDietDetails: null,
      takeMedication: false,
      haveMedicalSupplies: false,
      pets: [],
      havePetsFood: false,
      canProvideFood: false,
      canProvideLodging: true,
      canProvideClothing: true,
      canProvideTransportation: false,
      canProvideIncidentals: true,
      type: NeedsAssessmentType.Assessed
    },
    notes: [],
    supports: [],
    securityPhrase: 'l****a',
    securityPhraseEdited: false,
    isRestricted: false,
    status: EvacuationFileStatus.Active,
    evacuationFileDate: '2021-11-23T23:32:16Z',
    householdMembers: [
      {
        id: '42ab5087-ce1c-48ec-b339-1b1c173842d7',
        linkedRegistrantId: 'a677e7e1-54ea-48ef-a030-b48c56fccd9c',
        firstName: 'Anne',
        lastName: 'Lee',
        initials: null,
        gender: 'Female',
        dateOfBirth: '09/09/1999',
        type: HouseholdMemberType.Registrant,
        isPrimaryRegistrant: true,
        isHouseholdMember: false,
        isMinor: false,
        isRestricted: false,
        isVerified: true
      },
      {
        id: 'c0350e7e-055b-45c9-b32d-1c81c14afdd5',
        linkedRegistrantId: null,
        firstName: 'abcd',
        lastName:
          'erfehrbfjherbfjhrebfjherhbfnceujkrsdhcnqeukasjdcnesjka,dnukasj,dmwehnfurgfyrgfgerhfjdvfdhjvbfdjhbvhd',
        initials: null,
        gender: 'Female',
        dateOfBirth: '09/09/1999',
        type: HouseholdMemberType.HouseholdMember,
        isPrimaryRegistrant: false,
        isHouseholdMember: true,
        isMinor: false,
        isRestricted: null,
        isVerified: null
      }
    ],
    task: {
      taskNumber: 'UNIT-TEST-ACTIVE-TASK',
      communityCode: '9e6adfaf-9f97-ea11-b813-005056830319',
      from: '2021-05-12T21:31:00Z',
      to: '2022-09-08T18:53:00Z'
    },
    assignedTaskCommunity: {
      code: '9e6adfaf-9f97-ea11-b813-005056830319',
      name: 'Victoria',
      districtName: 'Capital',
      stateProvinceCode: 'BC',
      countryCode: 'CAN',
      type: CommunityType.City
    }
  };
  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
    events: of(new NavigationStart(1, 'regular')),
    getCurrentNavigation: () => ({
      extras: { state: mockEssfileState }
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CustomPipeModule,
        HttpClientTestingModule,
        MatDialogModule,
        ReactiveFormsModule
      ],
      declarations: [EssFileDetailsComponent],
      providers: [
        EssFileDetailsComponent,
        {
          provide: EssfileDashboardService,
          useClass: MockEssfileDashboardService
        },
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: OptionInjectionService,
          useClass: MockOptionInjectionService
        },
        { provide: computeInterfaceToken, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssFileDetailsComponent);
    component = fixture.componentInstance;
    essfileDashboardService = TestBed.inject(EssfileDashboardService);
    essfileDashboardService.essFile = mockEssfile;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get essFile from router', () => {
    mockEssfileState = { file: mockEssfile };
    const routingTest = TestBed.inject(Router);
    const testMockComponent = new EssFileDetailsComponent(
      routingTest,
      essfileDashboardService
    );
    fixture.detectChanges();
    expect(testMockComponent.essFile).toBeDefined();
  });

  // it('should get essFile from service', () => {
  //   routerMock.getCurrentNavigation() = null;
  //   const routingTest = TestBed.inject(Router);
  //   const testMockComponent = new EssFileDetailsComponent(
  //     routingTest,
  //     essfileDashboardService
  //   );
  //   fixture.detectChanges();
  //   expect(testMockComponent.essFile).toBeDefined();
  // });
});
