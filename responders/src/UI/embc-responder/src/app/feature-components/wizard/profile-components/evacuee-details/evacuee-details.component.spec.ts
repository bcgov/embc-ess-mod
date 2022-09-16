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

import { EvacueeDetailsComponent } from './evacuee-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { computeInterfaceToken } from 'src/app/app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { MockAppBaseService } from 'src/app/unit-tests/mockAppBase.service';
import { EvacueeDetailsService } from './evacuee-details.service';
import { MockEvacueeDetailsService } from 'src/app/unit-tests/mockEvacueeDetails.service';
import { Router } from '@angular/router';

describe('EvacueeDetailsComponent', () => {
  let component: EvacueeDetailsComponent;
  let fixture: ComponentFixture<EvacueeDetailsComponent>;
  let appBaseService;
  let detailsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatDialogModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      declarations: [EvacueeDetailsComponent],
      providers: [
        UntypedFormBuilder,
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: AppBaseService,
          useClass: MockAppBaseService
        },
        {
          provide: EvacueeDetailsService,
          useClass: MockEvacueeDetailsService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacueeDetailsComponent);
    component = fixture.componentInstance;
    appBaseService = TestBed.inject(AppBaseService);
    detailsService = TestBed.inject(EvacueeDetailsService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display all the input elements of the form group', () => {
    fixture.detectChanges();
    const formElem = fixture.debugElement.nativeElement.querySelector(
      '#evacueeDetailsForm'
    );
    const totalElems = formElem.querySelectorAll('input');
    expect(totalElems.length).toEqual(5);
  });

  it('should display gender form control as a dropdown', () => {
    fixture.detectChanges();
    const formElem = fixture.debugElement.nativeElement.querySelector(
      '#evacueeDetailsForm'
    );
    const totalElems = formElem.querySelectorAll('mat-select');
    expect(totalElems.length).toEqual(1);
  });

  it('form should display default values', () => {
    appBaseService.wizardProperties = {
      editFlag: false
    };
    detailsService.stepEvacueeProfileService.personalDetails = {
      firstName: null,
      lastName: null,
      preferredName: '',
      gender: '',
      initials: '',
      dateOfBirth: null
    };
    fixture.detectChanges();
    component.ngOnInit();

    const evacueeForm = component.evacueeDetailsForm;
    const formValues = {
      firstName: null,
      lastName: null,
      preferredName: '',
      initials: '',
      gender: '',
      dateOfBirth: null
    };
    expect(evacueeForm.getRawValue()).toEqual(formValues);
  });

  it('form should display saved form values if the user is editing profile', () => {
    appBaseService.wizardProperties = {
      editFlag: true
    };
    detailsService.stepEvacueeProfileService.personalDetails = {
      firstName: 'Unit',
      lastName: 'Test',
      preferredName: 'T',
      gender: 'F',
      initials: 'U.T',
      dateOfBirth: '01/01/2000'
    };
    fixture.detectChanges();
    component.ngOnInit();

    fixture.detectChanges();
    const evacueeForm = component.evacueeDetailsForm;
    const formValues = {
      firstName: 'Unit',
      lastName: 'Test',
      preferredName: 'T',
      gender: 'F',
      initials: 'U.T',
      dateOfBirth: '01/01/2000'
    };
    expect(evacueeForm.getRawValue()).toEqual(formValues);
  });

  it('form should disable fields if profile is VERIFIED', () => {
    appBaseService.wizardProperties = {
      editFlag: true
    };
    detailsService.stepEvacueeProfileService.personalDetails = {
      firstName: 'Unit',
      lastName: 'Test',
      preferredName: 'T',
      gender: 'F',
      initials: 'U.T',
      dateOfBirth: '01/01/2000'
    };
    detailsService.stepEvacueeProfileService.verifiedProfile = true;
    fixture.detectChanges();
    component.ngOnInit();

    fixture.detectChanges();
    const evacueeForm = component.evacueeDetailsForm;
    expect(evacueeForm.get('firstName').disabled).toEqual(true);
    expect(evacueeForm.get('lastName').disabled).toEqual(true);
    expect(evacueeForm.get('dateOfBirth').disabled).toEqual(true);
  });

  it('form should enable fields if profile is NOT VERIFIED', () => {
    appBaseService.wizardProperties = {
      editFlag: true
    };
    detailsService.stepEvacueeProfileService.personalDetails = {
      firstName: 'Unit',
      lastName: 'Test',
      preferredName: 'T',
      gender: 'F',
      initials: 'U.T',
      dateOfBirth: '01/01/2000'
    };
    detailsService.stepEvacueeProfileService.verifiedProfile = false;
    fixture.detectChanges();
    component.ngOnInit();

    fixture.detectChanges();
    const evacueeForm = component.evacueeDetailsForm;
    expect(evacueeForm.get('firstName').disabled).toEqual(false);
    expect(evacueeForm.get('lastName').disabled).toEqual(false);
    expect(evacueeForm.get('dateOfBirth').disabled).toEqual(false);
  });

  it('form should disable fields if profile is AUTHENICATED WITH BCSC', () => {
    appBaseService.wizardProperties = {
      editFlag: true
    };
    detailsService.stepEvacueeProfileService.personalDetails = {
      firstName: 'Unit',
      lastName: 'Test',
      preferredName: 'T',
      gender: 'F',
      initials: 'U.T',
      dateOfBirth: '01/01/2000'
    };
    detailsService.stepEvacueeProfileService.verifiedProfile = false;
    detailsService.stepEvacueeProfileService.authorizedUser = true;
    fixture.detectChanges();
    component.ngOnInit();

    fixture.detectChanges();
    const evacueeForm = component.evacueeDetailsForm;
    expect(evacueeForm.get('firstName').disabled).toEqual(true);
    expect(evacueeForm.get('lastName').disabled).toEqual(true);
    expect(evacueeForm.get('dateOfBirth').disabled).toEqual(true);
  });

  it('form should enable fields if profile is NOT AUTHENICATED WITH BCSC', () => {
    appBaseService.wizardProperties = {
      editFlag: true
    };
    detailsService.stepEvacueeProfileService.personalDetails = {
      firstName: 'Unit',
      lastName: 'Test',
      preferredName: 'T',
      gender: 'F',
      initials: 'U.T',
      dateOfBirth: '01/01/2000'
    };
    detailsService.stepEvacueeProfileService.verifiedProfile = false;
    detailsService.stepEvacueeProfileService.authorizedUser = false;
    fixture.detectChanges();
    fixture.detectChanges();
    component.ngOnInit();

    fixture.detectChanges();
    const evacueeForm = component.evacueeDetailsForm;
    expect(evacueeForm.get('firstName').disabled).toEqual(false);
    expect(evacueeForm.get('lastName').disabled).toEqual(false);
    expect(evacueeForm.get('dateOfBirth').disabled).toEqual(false);
  });

  it('form should display COMPLETE tab status', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.wizardProperties = {
        editFlag: false
      };
      detailsService.stepEvacueeProfileService.profileTabsValue =
        detailsService.stepEvacueeProfileService.evacueeProfileTabs;
      detailsService.stepEvacueeProfileService.personalDetails = {
        firstName: 'Unit',
        lastName: 'Test',
        preferredName: 'T',
        gender: 'F',
        initials: 'U.T',
        dateOfBirth: '01/01/2000'
      };
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      component.next();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      detailsService.cleanup(component.evacueeDetailsForm);
      fixture.detectChanges();

      tick();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();
      const tabMetaData =
        detailsService.stepEvacueeProfileService.profileTabs.find(
          (tab) => tab.name === 'evacuee-details'
        );

      expect(tabMetaData.status).toEqual('complete');
    })
  ));

  it('form should display INCOMPLETE tab status', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.wizardProperties = {
        editFlag: false
      };
      detailsService.stepEvacueeProfileService.profileTabsValue =
        detailsService.stepEvacueeProfileService.evacueeProfileTabs;
      detailsService.stepEvacueeProfileService.personalDetails = {
        firstName: 'Unit',
        lastName: 'Test',
        preferredName: 'T',
        gender: '',
        initials: 'U.T',
        dateOfBirth: '01/01/2000'
      };
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      component.next();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      detailsService.cleanup(component.evacueeDetailsForm);
      fixture.detectChanges();

      tick();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();
      const tabMetaData =
        detailsService.stepEvacueeProfileService.profileTabs.find(
          (tab) => tab.name === 'evacuee-details'
        );

      expect(tabMetaData.status).toEqual('incomplete');
    })
  ));

  it('should navigate to RESTRICTION PAGE on back', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.wizardProperties = {
        editFlag: false
      };
      detailsService.stepEvacueeProfileService.profileTabsValue =
        detailsService.stepEvacueeProfileService.evacueeProfileTabs;
      detailsService.stepEvacueeProfileService.personalDetails = {
        firstName: 'Unit',
        lastName: 'Test',
        preferredName: 'T',
        gender: '',
        initials: 'U.T',
        dateOfBirth: '01/01/2000'
      };
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      component.back();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();

      expect(router.navigate).toHaveBeenCalledWith([
        '/ess-wizard/evacuee-profile/restriction'
      ]);
    })
  ));

  it('should navigate to ADDRESS PAGE on next', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.wizardProperties = {
        editFlag: false
      };
      detailsService.stepEvacueeProfileService.profileTabsValue =
        detailsService.stepEvacueeProfileService.evacueeProfileTabs;
      detailsService.stepEvacueeProfileService.personalDetails = {
        firstName: 'Unit',
        lastName: 'Test',
        preferredName: 'T',
        gender: '',
        initials: 'U.T',
        dateOfBirth: '01/01/2000'
      };
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      component.next();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();

      expect(router.navigate).toHaveBeenCalledWith([
        '/ess-wizard/evacuee-profile/address'
      ]);
    })
  ));
});
