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
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { MaterialModule } from 'src/app/material.module';
import { MockEvacueeSearchService } from 'src/app/unit-tests/mockEvacueeSearch.service';
import { MockEvacueeSessionService } from 'src/app/unit-tests/mockEvacueeSession.service';
import { EvacueeSearchService } from '../evacuee-search.service';
import { EvacueeIdVerifyComponent } from './evacuee-id-verify.component';

describe('EvacueeIdVerifyComponent', () => {
  let component: EvacueeIdVerifyComponent;
  let fixture: ComponentFixture<EvacueeIdVerifyComponent>;
  let evacueeSessionService;
  let evacueeSearchService;

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
        { provide: EvacueeSearchService, useClass: MockEvacueeSearchService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacueeIdVerifyComponent);
    component = fixture.componentInstance;
    evacueeSessionService = TestBed.inject(EvacueeSessionService);
    evacueeSearchService = TestBed.inject(EvacueeSearchService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get paper based true from service', () => {
    evacueeSessionService.paperBased = true;
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.paperBased).toEqual(true);
  });

  it('should get paper based false from service', () => {
    evacueeSessionService.paperBased = false;
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.paperBased).toEqual(false);
  });

  it('should get present ID true from form', () => {
    fixture.detectChanges();
    component.ngOnInit();
    component.idVerifyForm.get('photoId').setValue(true);
    component.next();

    expect(
      evacueeSearchService.evacueeSearchContext.hasShownIdentification
    ).toEqual(true);
  });

  it('should get present ID false from form', () => {
    fixture.detectChanges();
    component.ngOnInit();
    component.idVerifyForm.get('photoId').setValue(false);
    component.next();

    expect(
      evacueeSearchService.evacueeSearchContext.hasShownIdentification
    ).toEqual(false);
  });

  it('should get label for Paper-based ID', fakeAsync(() => {
    evacueeSessionService.paperBased = true;
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const labelElem = nativeElem.querySelector('#photoId-label');

    expect(labelElem.textContent).toEqual(
      ' Did the evacuee present any government-issued photo ID when the paper ESS File was completed? '
    );
  }));

  it('should get label for Digital-based ID', fakeAsync(() => {
    evacueeSessionService.paperBased = false;
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const labelElem = nativeElem.querySelector('#photoId-label');

    expect(labelElem.textContent).toEqual(
      ' Can you present any government-issued photo ID to verify your identity? '
    );
  }));
});
