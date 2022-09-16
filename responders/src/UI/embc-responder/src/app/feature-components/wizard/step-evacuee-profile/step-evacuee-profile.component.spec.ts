import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync
} from '@angular/core/testing';

import { StepEvacueeProfileComponent } from './step-evacuee-profile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SecurityQuestionsService } from 'src/app/core/services/security-questions.service';
import { MockSecurityQuestionsService } from 'src/app/unit-tests/mockSecurityQuestions.service';
import { StepEvacueeProfileService } from './step-evacuee-profile.service';
import { MockStepEvacueeProfileService } from 'src/app/unit-tests/mockStepEvacueeProfile.service';
import { WizardDataService } from '../wizard-data.service';
import { NavigationStart, Router } from '@angular/router';
import { of } from 'rxjs';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { MockAlertService } from 'src/app/unit-tests/mockAlert.service';
import { computeInterfaceToken } from 'src/app/app.module';

describe('StepEvacueeProfileComponent', () => {
  let component: StepEvacueeProfileComponent;
  let fixture: ComponentFixture<StepEvacueeProfileComponent>;
  let securityQuestionsService;
  let wizardService;
  let stepProfileService;
  let alertService;
  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
    events: of(new NavigationStart(1, 'regular')),
    getCurrentNavigation: () => ({
      extras: { state: { step: 'STEP 1', title: 'Create Evacuee Profile' } }
    })
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        MatDialogModule,
        HttpClientTestingModule
      ],
      declarations: [StepEvacueeProfileComponent],
      providers: [
        WizardDataService,
        { provide: Router, useValue: routerMock },
        {
          provide: StepEvacueeProfileService,
          useClass: MockStepEvacueeProfileService
        },
        { provide: computeInterfaceToken, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepEvacueeProfileComponent);
    component = fixture.componentInstance;
    wizardService = TestBed.inject(WizardDataService);
    stepProfileService = TestBed.inject(StepEvacueeProfileService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load evacuee profile tabs', () => {
    stepProfileService.profileTabsValue = stepProfileService.evacueeProfileTabs;
    const test = TestBed.inject(Router);
    const testMockComponent = new StepEvacueeProfileComponent(
      test,
      stepProfileService
    );
    fixture.detectChanges();
    expect(testMockComponent.tabs).toBeDefined();
  });

  it('should load evacuee profile with security questions for digital flow', () => {
    stepProfileService.profileTabsValue = stepProfileService.evacueeProfileTabs;
    const expectedTab = {
      label: 'Security Questions',
      route: 'security-questions',
      name: 'security-questions',
      status: 'not-started',
      next: '/ess-wizard/evacuee-profile/review',
      previous: '/ess-wizard/evacuee-profile/contact'
    };
    const test = TestBed.inject(Router);
    const testMockComponent = new StepEvacueeProfileComponent(
      test,
      stepProfileService
    );
    fixture.detectChanges();
    expect(testMockComponent.tabs).toContain(expectedTab);
  });

  it('should load evacuee profile without security questions for paper based', () => {
    stepProfileService.profileTabsValue =
      stepProfileService.paperEvacueeProfileTabs;
    const expectedTab = {
      label: 'Security Questions',
      route: 'security-questions',
      name: 'security-questions',
      status: 'not-started',
      next: '/ess-wizard/evacuee-profile/review',
      previous: '/ess-wizard/evacuee-profile/contact'
    };
    const test = TestBed.inject(Router);
    const testMockComponent = new StepEvacueeProfileComponent(
      test,
      stepProfileService
    );
    fixture.detectChanges();
    expect(testMockComponent.tabs.indexOf(expectedTab)).toBe(-1);
  });
});
