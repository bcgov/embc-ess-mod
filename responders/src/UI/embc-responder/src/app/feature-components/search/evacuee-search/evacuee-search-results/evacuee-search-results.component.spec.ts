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

import { EvacueeSearchResultsComponent } from './evacuee-search-results.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { EvacueeSearchService } from '../evacuee-search.service';
import { MockEvacueeSearchService } from 'src/app/unit-tests/mockEvacueeSearch.service';
import { Router } from '@angular/router';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { EvacueeSearchResultsService } from './evacuee-search-results.service';
import { MockEvacueeSearchResultsService } from 'src/app/unit-tests/mockEvacueeSearchResults.service';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { MockEvacueeProfileService } from 'src/app/unit-tests/mockEvacueeProfile.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { computeInterfaceToken } from 'src/app/app.module';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { MockOptionInjectionService } from 'src/app/unit-tests/mockOptionInjection.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { MockAppBaseService } from 'src/app/unit-tests/mockAppBase.service';
import { SelectedPathType } from 'src/app/core/models/appBase.model';
import { Component } from '@angular/core';

@Component({ selector: 'app-zero-file-result', template: '' })
class ZeroFileResultStubComponent {}

describe('EvacueeSearchResultsComponent', () => {
  let component: EvacueeSearchResultsComponent;
  let fixture: ComponentFixture<EvacueeSearchResultsComponent>;
  let evacueeSearchService;
  let evacueeSearchResultsService;
  let evacueeProfileService;
  let injectionService;
  let appBaseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EvacueeSearchResultsComponent,
        ZeroFileResultStubComponent
      ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        EvacueeSearchResultsComponent,
        { provide: EvacueeSearchService, useClass: MockEvacueeSearchService },
        {
          provide: EvacueeSearchResultsService,
          useClass: MockEvacueeSearchResultsService
        },
        {
          provide: EvacueeProfileService,
          useClass: MockEvacueeProfileService
        },
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
    fixture = TestBed.createComponent(EvacueeSearchResultsComponent);
    component = fixture.componentInstance;
    evacueeSearchService = TestBed.inject(EvacueeSearchService);
    evacueeSearchResultsService = TestBed.inject(EvacueeSearchResultsService);
    evacueeProfileService = TestBed.inject(EvacueeProfileService);
    injectionService = TestBed.inject(OptionInjectionService);
    appBaseService = TestBed.inject(AppBaseService);
  });

  it('should create', () => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.digital
    };
    evacueeSearchService.evacueeSearchContext = {
      hasShownIdentification: true,
      evacueeSearchParameters: {
        firstName: 'Evac',
        lastName: 'Five',
        dateOfBirth: '12/12/2000'
      }
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show zero results page for remote extensions', () => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.remoteExtensions
    };

    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const optionsElem = nativeElem.querySelector('app-zero-file-result');
    expect(optionsElem).toBeDefined();
  });

  it('should not have new registration button for remote extensions', () => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.remoteExtensions
    };

    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const optionsElem = nativeElem.querySelector('new-registration-box');
    expect(optionsElem).toBe(null);
  });

  it('should appear paper based search results title', () => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.paperBased
    };
    evacueeSearchService.evacueeSearchContext = {
      hasShownIdentification: true,
      evacueeSearchParameters: {
        firstName: 'Evac',
        lastName: 'Five',
        dateOfBirth: '12/12/2000',
        paperFileNumber: 'T123456'
      }
    };

    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const titleElem = nativeElem.querySelector('.result-text');

    expect(titleElem.textContent).toEqual(
      ' Results for "FIVE, Evac" with a date of birth "12-Dec-2000" and a paper ESS File # T123456.'
    );
  });

  it('should appear digital based search results title', () => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.digital
    };
    evacueeSearchService.evacueeSearchContext = {
      hasShownIdentification: true,
      evacueeSearchParameters: {
        firstName: 'Evac',
        lastName: 'Five',
        dateOfBirth: '12/12/2000'
      }
    };
    fixture.detectChanges();
    component.ngOnInit();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const titleElem = nativeElem.querySelector('.result-text');

    expect(titleElem.textContent).toEqual(
      ' Results for "FIVE, Evac" with a date of birth "12-Dec-2000".'
    );
  });

  it('should be able to start New Registration for digital flow', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();

      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.digital
      };
      evacueeSearchService.evacueeSearchContext = {
        hasShownIdentification: true,
        evacueeSearchParameters: {
          firstName: 'Evac',
          lastName: 'Five',
          dateOfBirth: '12/12/2000'
        }
      };

      fixture.detectChanges();
      component.ngOnInit();
      component.openWizard();

      expect(router.navigate).toHaveBeenCalledWith(['/ess-wizard'], {
        queryParams: { type: WizardType.NewRegistration },
        queryParamsHandling: 'merge'
      });
    }
  ));

  it('should be able to start New Registration for Paper flow if Paper file does not exist', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();

      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.paperBased
      };
      evacueeSearchService.evacueeSearchContext = {
        hasShownIdentification: true,
        evacueeSearchParameters: {
          firstName: 'Evac',
          lastName: 'Five',
          dateOfBirth: '12/12/2000',
          paperFileNumber: 'T123456'
        }
      };

      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();
      component.openWizard();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith(['/ess-wizard'], {
        queryParams: { type: WizardType.NewRegistration },
        queryParamsHandling: 'merge'
      });
    })
  ));

  it('should NOT be able to start New Registration for Paper flow if Paper file exists', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();

      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.paperBased
      };
      evacueeSearchService.evacueeSearchContext = {
        hasShownIdentification: true,
        evacueeSearchParameters: {
          firstName: 'Evac',
          lastName: 'Five',
          dateOfBirth: '12/12/2000',
          paperFileNumber: 'T100'
        }
      };
      fixture.detectChanges();
      component.ngOnInit();
      component.openWizard();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();
      tick();
      fixture.detectChanges();

      const dialogContent = document.getElementsByTagName(
        'app-ess-file-exists'
      )[0] as HTMLElement;
      expect(dialogContent).toBeTruthy();
    })
  ));

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
