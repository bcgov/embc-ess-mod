import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepEssFileComponent } from './step-ess-file.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';
import { WizardDataService } from '../wizard-data.service';
import { StepEssFileService } from './step-ess-file.service';
import { MockStepEssFileService } from 'src/app/unit-tests/mockStepEssFile.service';
import { computeInterfaceToken } from 'src/app/app.module';

describe('StepEssFileComponent', () => {
  let component: StepEssFileComponent;
  let fixture: ComponentFixture<StepEssFileComponent>;
  let stepEssFileService;
  let wizardService;
  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
    events: of(new NavigationStart(1, 'regular')),
    getCurrentNavigation: () => ({
      extras: { state: { step: 'STEP 2', title: 'Create ESS File' } }
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule, HttpClientTestingModule],
      declarations: [StepEssFileComponent],
      providers: [
        WizardDataService,
        { provide: Router, useValue: routerMock },
        {
          provide: StepEssFileService,
          useClass: MockStepEssFileService
        },
        { provide: computeInterfaceToken, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepEssFileComponent);
    component = fixture.componentInstance;
    wizardService = TestBed.inject(WizardDataService);
    stepEssFileService = TestBed.inject(StepEssFileService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load ess file tabs', () => {
    stepEssFileService.essTabsValue = stepEssFileService.essFileTabs;
    const test = TestBed.inject(Router);
    const testMockComponent = new StepEssFileComponent(
      test,
      stepEssFileService
    );
    fixture.detectChanges();
    expect(testMockComponent.tabs).toBeDefined();
  });

  it('should load ess file with security phrase for digital flow', () => {
    stepEssFileService.essTabsValue = stepEssFileService.essFileTabs;
    const expectedTab = {
      label: 'Security Phrase',
      route: 'security-phrase',
      name: 'security-phrase',
      status: 'not-started',
      next: '/ess-wizard/ess-file/review',
      previous: '/ess-wizard/ess-file/needs'
    };
    const test = TestBed.inject(Router);
    const testMockComponent = new StepEssFileComponent(
      test,
      stepEssFileService
    );
    fixture.detectChanges();
    expect(testMockComponent.tabs).toContain(expectedTab);
  });

  it('should load ess file without security questions for paper based', () => {
    stepEssFileService.essTabsValue = stepEssFileService.paperEssFileTabs;
    const expectedTab = {
      label: 'Security Phrase',
      route: 'security-phrase',
      name: 'security-phrase',
      status: 'not-started',
      next: '/ess-wizard/ess-file/review',
      previous: '/ess-wizard/ess-file/needs'
    };
    const test = TestBed.inject(Router);
    const testMockComponent = new StepEssFileComponent(
      test,
      stepEssFileService
    );
    fixture.detectChanges();
    expect(testMockComponent.tabs.indexOf(expectedTab)).toBe(-1);
  });
});
