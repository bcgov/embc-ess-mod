import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { computeInterfaceToken } from 'src/app/app.module';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { MaterialModule } from 'src/app/material.module';
import { MockEvacueeSearchService } from 'src/app/unit-tests/mockEvacueeSearch.service';
import { MockEvacueeSessionService } from 'src/app/unit-tests/mockEvacueeSession.service';
import { MockOptionInjectionService } from 'src/app/unit-tests/mockOptionInjection.service';
import { EvacueeSearchService } from '../evacuee-search.service';
import { EvacueeIdVerifyComponent } from './evacuee-id-verify.component';

describe('EvacueeIdVerifyComponent', () => {
  let component: EvacueeIdVerifyComponent;
  let fixture: ComponentFixture<EvacueeIdVerifyComponent>;
  let evacueeSessionService;
  let evacueeSearchService;
  let injectionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvacueeIdVerifyComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        EvacueeIdVerifyComponent,
        FormBuilder,
        { provide: EvacueeSessionService, useClass: MockEvacueeSessionService },
        { provide: EvacueeSearchService, useClass: MockEvacueeSearchService },
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: OptionInjectionService,
          useClass: MockOptionInjectionService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacueeIdVerifyComponent);
    component = fixture.componentInstance;
    evacueeSessionService = TestBed.inject(EvacueeSessionService);
    evacueeSearchService = TestBed.inject(EvacueeSearchService);
    injectionService = TestBed.inject(OptionInjectionService);
  });

  // it('should create', () => {
  //   fixture.detectChanges();
  //   expect(component).toBeTruthy();
  // });

  // it('should get present ID true from form', () => {
  //   fixture.detectChanges();
  //   component.ngOnInit();
  //   component.idVerifyForm.get('photoId').setValue(true);
  //   component.next();

  //   expect(
  //     evacueeSearchService.evacueeSearchContext.hasShownIdentification
  //   ).toEqual(true);
  // });

  // it('should get present ID false from form', () => {
  //   fixture.detectChanges();
  //   component.ngOnInit();
  //   component.idVerifyForm.get('photoId').setValue(false);
  //   component.next();

  //   expect(
  //     evacueeSearchService.evacueeSearchContext.hasShownIdentification
  //   ).toEqual(false);
  // });

  // it('should get label for Paper-based ID', fakeAsync(() => {
  //   evacueeSessionService.isPaperBased = true;
  //   fixture.detectChanges();
  //   component.ngOnInit();

  //   flush();
  //   flushMicrotasks();
  //   discardPeriodicTasks();
  //   tick();
  //   fixture.detectChanges();
  //   const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
  //   const labelElem = nativeElem.querySelector('#photoId-label');

  //   expect(labelElem.textContent).toEqual(
  //     ' Did the evacuee present any government-issued photo ID when the paper ESS File was completed? '
  //   );
  // }));

  // it('should get label for Digital-based ID', fakeAsync(() => {
  //   evacueeSessionService.isPaperBased = false;
  //   fixture.detectChanges();
  //   component.ngOnInit();

  //   flush();
  //   flushMicrotasks();
  //   discardPeriodicTasks();
  //   tick();
  //   fixture.detectChanges();
  //   const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
  //   const labelElem = nativeElem.querySelector('#photoId-label');

  //   expect(labelElem.textContent).toEqual(
  //     ' Can you present any government-issued photo ID to verify your identity? '
  //   );
  // }));
});
