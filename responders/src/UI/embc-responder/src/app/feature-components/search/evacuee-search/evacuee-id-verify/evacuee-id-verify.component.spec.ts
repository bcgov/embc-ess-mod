import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
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
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { computeInterfaceToken } from 'src/app/app.module';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { SelectedPathType } from 'src/app/core/models/appBase.model';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { MaterialModule } from 'src/app/material.module';
import { MockAppBaseService } from 'src/app/unit-tests/mockAppBase.service';
import { MockEvacueeSearchService } from 'src/app/unit-tests/mockEvacueeSearch.service';
import { MockOptionInjectionService } from 'src/app/unit-tests/mockOptionInjection.service';
import { EvacueeSearchService } from '../evacuee-search.service';
import { EvacueeIdVerifyComponent } from './evacuee-id-verify.component';

describe('EvacueeIdVerifyComponent', () => {
  let component: EvacueeIdVerifyComponent;
  let fixture: ComponentFixture<EvacueeIdVerifyComponent>;
  let injectionService;
  let appBaseService;

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
        UntypedFormBuilder,
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: OptionInjectionService,
          useClass: MockOptionInjectionService
        },
        {
          provide: AppBaseService,
          useClass: MockAppBaseService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacueeIdVerifyComponent);
    component = fixture.componentInstance;
    injectionService = TestBed.inject(OptionInjectionService);
    appBaseService = TestBed.inject(AppBaseService);
  });

  it('should create', () => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.digital
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display id question for Paper-based selection', () => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.paperBased
    };
    fixture.detectChanges();
    component.ngOnInit();

    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const labelElem = nativeElem.querySelector('#photoId-label');

    expect(labelElem.textContent).toEqual(
      'Did the evacuee present any government-issued photo ID when the paper ESS File was completed?'
    );
  });

  it('shoulddisplay id question for Digital selection', () => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.digital
    };
    fixture.detectChanges();
    component.ngOnInit();

    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const labelElem = nativeElem.querySelector('#photoId-label');

    expect(labelElem.textContent).toEqual(
      'Can you present any government-issued photo ID to verify your identity?'
    );
  });

  it('should set id value and navigate to name search for digital', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.digital
      };
      fixture.detectChanges();
      component.ngOnInit();
      component.idVerifyForm.get('photoId').setValue(true);
      component.next();

      expect(router.navigate).toHaveBeenCalledWith(
        ['/responder-access/search/evacuee/name-search'],
        Object({ skipLocationChange: true })
      );
    }
  ));

  it('should set id value and navigate to name search for paper flow', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.paperBased
      };
      fixture.detectChanges();
      component.ngOnInit();
      component.idVerifyForm.get('photoId').setValue(false);
      component.next();

      expect(router.navigate).toHaveBeenCalledWith(
        ['/responder-access/search/evacuee/name-search'],
        Object({ skipLocationChange: true })
      );
    }
  ));

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
