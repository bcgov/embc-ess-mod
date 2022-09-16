import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync
} from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MockWizardService } from 'src/app/unit-tests/mockWizard.service';

import { WizardComponent } from './wizard.component';
import { WizardService } from './wizard.service';
import { WizardDataService } from './wizard-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StepEvacueeProfileComponent } from './step-evacuee-profile/step-evacuee-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StepEssFileComponent } from './step-ess-file/step-ess-file.component';
import { By } from '@angular/platform-browser';
import { computeInterfaceToken } from 'src/app/app.module';
import { DatePipe } from '@angular/common';

describe('WizardComponent-Test for New Registration', () => {
  let component: WizardComponent;
  let fixture: ComponentFixture<WizardComponent>;
  let wizardService;
  let wizardDataService;
  const activatedRouteMock = {
    snapshot: { queryParams: { type: 'new-registration' } }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WizardComponent],
      imports: [
        MatDialogModule,
        RouterTestingModule.withRoutes([
          {
            path: 'ess-wizard/evacuee-profile',
            component: StepEvacueeProfileComponent
          },
          {
            path: 'ess-wizard/ess-file',
            component: StepEssFileComponent
          }
        ]),
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        WizardComponent,
        WizardDataService,
        DatePipe,
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        {
          provide: WizardService,
          useClass: MockWizardService
        },
        { provide: computeInterfaceToken, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardComponent);
    component = fixture.componentInstance;
    wizardService = TestBed.inject(WizardService);
    wizardDataService = TestBed.inject(WizardDataService);
  });

  it('should create', inject([Router], (router: Router) => {
    spyOn(router, 'navigate').and.stub();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));

  it('should load NEW-REGISTRATION menu from compute wizard service', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      component.sideNavMenu = wizardDataService.newRegistrationMenu;
      wizardService.menuItems = wizardDataService.newRegistrationMenu;
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.sideNavMenu.length).toBe(4);
    }
  ));

  it('should load EDIT-REGISTRATION menu', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      component.sideNavMenu = wizardDataService.editProfileMenu;
      fixture.detectChanges();
      expect(component.sideNavMenu.length).toBe(1);
    }
  ));

  it('should navigate to STEP 1- Edit Evacuee Profile', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      component.sideNavMenu = wizardDataService.editProfileMenu;
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalledWith(
        ['/ess-wizard/evacuee-profile'],
        { state: { step: 'STEP 1', title: 'Edit Evacuee Profile' } }
      );
    }
  ));

  it('should load NEW-ESS-FILE menu', inject([Router], (router: Router) => {
    spyOn(router, 'navigate').and.stub();
    component.sideNavMenu = wizardDataService.newESSFileMenu;
    fixture.detectChanges();
    expect(component.sideNavMenu.length).toBe(3);
  }));

  it('should navigate to STEP 1- Create ESS File', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      component.sideNavMenu = wizardDataService.newESSFileMenu;
      fixture.detectChanges();
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['/ess-wizard/ess-file'], {
        state: { step: 'STEP 1', title: 'Create ESS File' }
      });
    }
  ));

  it('should load MEMBER-REGISTRATION menu', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      component.sideNavMenu = wizardDataService.membersProfileMenu;
      fixture.detectChanges();
      expect(component.sideNavMenu.length).toBe(1);
    }
  ));

  it('should load REVIEW-FILE menu', inject([Router], (router: Router) => {
    spyOn(router, 'navigate').and.stub();
    component.sideNavMenu = wizardDataService.reviewESSFileMenu;
    fixture.detectChanges();
    expect(component.sideNavMenu.length).toBe(3);
  }));

  it('should load COMPLETE-FILE menu', inject([Router], (router: Router) => {
    spyOn(router, 'navigate').and.stub();
    component.sideNavMenu = wizardDataService.completeESSFileMenu;
    fixture.detectChanges();
    expect(component.sideNavMenu.length).toBe(3);
  }));

  it('should navigate to STEP 1- Evacuee Profile', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      component.sideNavMenu = wizardDataService.newRegistrationMenu;
      wizardService.menuItems = wizardDataService.newRegistrationMenu;
      fixture.detectChanges();
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(
        ['/ess-wizard/evacuee-profile'],
        { state: { step: 'STEP 1', title: 'Create Evacuee Profile' } }
      );
    }
  ));

  it('should not allow navigation to STEP-2 if STEP-1 is incomplete', inject(
    [Router],
    (router: Router) => {
      spyOn(wizardService, 'openLockedModal');
      component.sideNavMenu = wizardDataService.newRegistrationMenu;
      wizardService.menuItems = wizardDataService.newRegistrationMenu;
      fixture.detectChanges();
      component.ngOnInit();
      component.goToStep(true, new MouseEvent('click'), '/ess-wizard/ess-file');
      expect(wizardService.openLockedModal).toHaveBeenCalled();
    }
  ));

  it('should open exit modal window on click Exit wizard button', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      spyOn(wizardService, 'openExitModal');
      component.sideNavMenu = wizardDataService.newRegistrationMenu;
      wizardService.menuItems = wizardDataService.newRegistrationMenu;
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('.exit-button'));
      button.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(wizardService.openExitModal).toHaveBeenCalled();
    }
  ));
});
