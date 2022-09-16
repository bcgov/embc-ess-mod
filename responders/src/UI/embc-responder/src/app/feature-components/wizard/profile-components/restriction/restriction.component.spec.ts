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

import { RestrictionComponent } from './restriction.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { computeInterfaceToken } from 'src/app/app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RestrictionService } from './restriction.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { MockAppBaseService } from 'src/app/unit-tests/mockAppBase.service';
import { MaterialModule } from 'src/app/material.module';
import { MockRestrictionService } from 'src/app/unit-tests/mockRestriction.service';
import { Router } from '@angular/router';

describe('RestrictionComponent', () => {
  let component: RestrictionComponent;
  let fixture: ComponentFixture<RestrictionComponent>;
  let appBaseService;
  let restrictionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatDialogModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MaterialModule
      ],
      declarations: [RestrictionComponent],
      providers: [
        UntypedFormBuilder,
        { provide: computeInterfaceToken, useValue: {} },
        { provide: RestrictionService, useClass: MockRestrictionService },
        {
          provide: AppBaseService,
          useClass: MockAppBaseService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestrictionComponent);
    component = fixture.componentInstance;
    appBaseService = TestBed.inject(AppBaseService);
    restrictionService = TestBed.inject(MockRestrictionService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display all the input elements of the form group', () => {
    fixture.detectChanges();
    const formElem =
      fixture.debugElement.nativeElement.querySelector('#restrictionForm');
    const totalElems = formElem.querySelectorAll('mat-radio-group');
    expect(totalElems.length).toEqual(1);
  });

  it('form should display default values', () => {
    appBaseService.wizardProperties = {
      editFlag: false
    };
    restrictionService.stepEvacueeProfileService.restrictedAccess = null;
    fixture.detectChanges();
    component.ngOnInit();

    const restrictionForm = component.restrictionForm;
    const formValues = {
      restrictedAccess: ''
    };
    expect(restrictionForm.getRawValue()).toEqual(formValues);
  });

  it('form should display saved form values if the user is editing profile', () => {
    appBaseService.wizardProperties = {
      editFlag: true
    };
    restrictionService.stepEvacueeProfileService.restrictedAccess = false;
    fixture.detectChanges();
    component.ngOnInit();

    fixture.detectChanges();
    const restrictionForm = component.restrictionForm;
    const formValues = {
      restrictedAccess: false
    };
    expect(restrictionForm.getRawValue()).toEqual(formValues);
  });

  it('form should display COMPLETE tab status', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.wizardProperties = {
        editFlag: false
      };
      restrictionService.stepEvacueeProfileService.profileTabsValue =
        restrictionService.stepEvacueeProfileService.evacueeProfileTabs;
      restrictionService.stepEvacueeProfileService.restrictedAccess = false;
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      component.next();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      restrictionService.cleanup(component.restrictionForm);
      fixture.detectChanges();

      tick();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();
      const tabMetaData =
        restrictionService.stepEvacueeProfileService.profileTabs.find(
          (tab) => tab.name === 'restriction'
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
      restrictionService.stepEvacueeProfileService.profileTabsValue =
        restrictionService.stepEvacueeProfileService.evacueeProfileTabs;
      restrictionService.stepEvacueeProfileService.restrictedAccess = '';
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      component.next();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      restrictionService.cleanup(component.restrictionForm);
      fixture.detectChanges();

      tick();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();
      const tabMetaData =
        restrictionService.stepEvacueeProfileService.profileTabs.find(
          (tab) => tab.name === 'restriction'
        );

      expect(tabMetaData.status).toEqual('not-started');
    })
  ));

  it('should navigate to COLLECTION-NOTICE PAGE on back', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.wizardProperties = {
        editFlag: false
      };
      restrictionService.stepEvacueeProfileService.profileTabsValue =
        restrictionService.stepEvacueeProfileService.evacueeProfileTabs;
      restrictionService.stepEvacueeProfileService.restrictedAccess = false;
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      component.back();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();

      expect(router.navigate).toHaveBeenCalledWith([
        '/ess-wizard/evacuee-profile/collection-notice'
      ]);
    })
  ));

  it('should navigate to EVACUEE DETAILS PAGE on next', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.wizardProperties = {
        editFlag: false
      };
      restrictionService.stepEvacueeProfileService.profileTabsValue =
        restrictionService.stepEvacueeProfileService.evacueeProfileTabs;
      restrictionService.stepEvacueeProfileService.restrictedAccess = false;
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      component.next();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();

      expect(router.navigate).toHaveBeenCalledWith([
        '/ess-wizard/evacuee-profile/evacuee-details'
      ]);
    })
  ));
});
