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

import { ContactComponent } from './contact.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { computeInterfaceToken } from 'src/app/app.module';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { MockAppBaseService } from 'src/app/unit-tests/mockAppBase.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material.module';
import { _MatRadioButtonBase } from '@angular/material/radio';
import { StepEvacueeProfileService } from '../../step-evacuee-profile/step-evacuee-profile.service';
import { MockStepEvacueeProfileService } from 'src/app/unit-tests/mockStepEvacueeProfile.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { MockEvacueeSessionService } from 'src/app/unit-tests/mockEvacueeSession.service';
import { ContactService } from './contact.service';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let appBaseService;
  let stepProfileService;
  let evacueeSessionService;
  let contactService;

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
      declarations: [ContactComponent],
      providers: [
        UntypedFormBuilder,
        ContactService,
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: AppBaseService,
          useClass: MockAppBaseService
        },
        {
          provide: StepEvacueeProfileService,
          useClass: MockStepEvacueeProfileService
        },
        {
          provide: EvacueeSessionService,
          useClass: MockEvacueeSessionService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    appBaseService = TestBed.inject(AppBaseService);
    stepProfileService = TestBed.inject(StepEvacueeProfileService);
    evacueeSessionService = TestBed.inject(EvacueeSessionService);
    contactService = TestBed.inject(ContactService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display only radio button on page load', () => {
    fixture.detectChanges();
    const formElem =
      fixture.debugElement.nativeElement.querySelector('#contactInfoForm');
    const totalElems = formElem.querySelectorAll('mat-radio-group');
    expect(totalElems.length).toEqual(1);
  });

  it('should not display contact form if user selects NO CONTACT option', () => {
    stepProfileService.showContact = false;
    component.ngOnInit();
    fixture.detectChanges();

    component.hideContact({ source: {} as _MatRadioButtonBase, value: false });
    fixture.detectChanges();
    const formElem =
      fixture.debugElement.nativeElement.querySelector('#contactInfoForm');
    const totalElems = formElem.querySelectorAll('input');
    expect(totalElems.length).toEqual(2);
  });

  it('should display contact form if user selects YES CONTACT option', () => {
    stepProfileService.showContact = true;
    component.ngOnInit();
    fixture.detectChanges();

    component.hideContact({ source: {} as _MatRadioButtonBase, value: true });
    fixture.detectChanges();
    const formElem =
      fixture.debugElement.nativeElement.querySelector('#contactInfoForm');
    const totalElems = formElem.querySelectorAll('input');
    expect(totalElems.length).toEqual(5);
  });

  it('should navigate to ADDRESS PAGE on back', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();

      stepProfileService.profileTabsValue =
        stepProfileService.evacueeProfileTabs;
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      component.back();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();

      expect(router.navigate).toHaveBeenCalledWith([
        '/ess-wizard/evacuee-profile/address'
      ]);
    })
  ));

  it('should navigate to CONTACTS PAGE on next', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();

      stepProfileService.profileTabsValue =
        stepProfileService.evacueeProfileTabs;
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      component.next();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();

      expect(router.navigate).toHaveBeenCalledWith([
        '/ess-wizard/evacuee-profile/security-questions'
      ]);
    })
  ));

  it('should navigate to REVIEW PAGE on next if the selected flow is paperBased and all tabs have been completed', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();

      stepProfileService.profileTabsValue =
        stepProfileService.completedPaperEvacueeProfileTabs;
      evacueeSessionService.isPaperBased = true;
      stepProfileService.contactDetails = {
        email: 'a@a.gmail.com',
        phone: '7777777777'
      };
      stepProfileService.showContact = true;
      stepProfileService.confirmEmail = 'a@a.gmail.com';
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      component.next();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();

      expect(router.navigate).toHaveBeenCalledWith([
        '/ess-wizard/evacuee-profile/review'
      ]);
    })
  ));

  it('should open model window if the selected flow is paperBased and tabs are incomplete', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();

      stepProfileService.profileTabsValue =
        stepProfileService.paperEvacueeProfileTabs;
      evacueeSessionService.isPaperBased = true;
      stepProfileService.contactDetails = {
        email: 'a@a.gmail.com',
        phone: '7777777777'
      };
      stepProfileService.showContact = true;
      stepProfileService.confirmEmail = 'a@a.gmail.com';
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      component.next();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();
      const dialogContent = document.getElementsByTagName(
        'app-information-dialog'
      )[0] as HTMLElement;

      expect(dialogContent.textContent).toEqual(
        'Please complete all sections of the Evacuee Profile prior to submitting. Close '
      );
    })
  ));

  it('form should display INCOMPLETE tab status', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.wizardProperties = {
        editFlag: false
      };
      stepProfileService.profileTabsValue =
        stepProfileService.evacueeProfileTabs;
      evacueeSessionService.isPaperBased = true;
      stepProfileService.contactDetails = {
        email: 'a@a.gmail.com',
        phone: '7777777777'
      };
      stepProfileService.showContact = true;
      stepProfileService.confirmEmail = '';
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      component.next();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      contactService.cleanup(component.contactInfoForm);
      fixture.detectChanges();

      tick();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();
      const tabMetaData =
        contactService.stepEvacueeProfileService.profileTabs.find(
          (tab) => tab.name === 'contact'
        );

      expect(tabMetaData.status).toEqual('incomplete');
    })
  ));

  it('form should display COMPLETE tab status', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.wizardProperties = {
        editFlag: true
      };
      stepProfileService.profileTabsValue =
        stepProfileService.evacueeProfileTabs;
      evacueeSessionService.isPaperBased = true;
      stepProfileService.contactDetails = {
        email: 'a@a.gmail.com',
        phone: '7777777777'
      };
      stepProfileService.showContact = true;
      stepProfileService.confirmEmail = 'a@a.gmail.com';
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();
      component.next();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      contactService.cleanup(component.contactInfoForm);
      fixture.detectChanges();

      tick();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();
      const tabMetaData =
        contactService.stepEvacueeProfileService.profileTabs.find(
          (tab) => tab.name === 'contact'
        );

      expect(tabMetaData.status).toEqual('complete');
    })
  ));
});
