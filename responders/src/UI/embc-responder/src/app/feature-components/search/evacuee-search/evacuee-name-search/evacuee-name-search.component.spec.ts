import { HttpClientTestingModule } from '@angular/common/http/testing';
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
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { computeInterfaceToken } from 'src/app/app.module';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { SelectedPathType } from 'src/app/core/models/appBase.model';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { MockAppBaseService } from 'src/app/unit-tests/mockAppBase.service';
import { MockEvacueeSearchService } from 'src/app/unit-tests/mockEvacueeSearch.service';
import { MockEvacueeSessionService } from 'src/app/unit-tests/mockEvacueeSession.service';
import { MockOptionInjectionService } from 'src/app/unit-tests/mockOptionInjection.service';
import { EvacueeSearchComponent } from '../evacuee-search.component';
import { EvacueeSearchService } from '../evacuee-search.service';

import { EvacueeNameSearchComponent } from './evacuee-name-search.component';

describe('EvacueeNameSearchComponent', () => {
  let component: EvacueeNameSearchComponent;
  let fixture: ComponentFixture<EvacueeNameSearchComponent>;
  let injectionService;
  let appBaseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvacueeNameSearchComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        EvacueeNameSearchComponent,
        {
          provide: OptionInjectionService,
          useClass: MockOptionInjectionService
        },
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: AppBaseService,
          useClass: MockAppBaseService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacueeNameSearchComponent);
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

  it('should load digital form for digital flow', fakeAsync(() => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.digital
    };
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const fieldElem = nativeElem.querySelector('#essFilePaperBased');

    expect(fieldElem).toBeNull();
  }));

  it('should load paper form with paper file field for paper flow', fakeAsync(() => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.paperBased
    };
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const fieldElem = nativeElem.querySelector('#essFilePaperBased');

    expect(fieldElem).toBeDefined();
  }));

  it('should set digital form and navigate to search results page', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.digital
      };
      fixture.detectChanges();
      component.ngOnInit();
      component.nameSearchForm.get('firstName').setValue('EvacueeSearchTest');
      component.nameSearchForm.get('lastName').setValue('EvacueeSearchTest');
      component.nameSearchForm.get('dateOfBirth').setValue('11/11/2011');
      component.search();

      expect(router.navigate).toHaveBeenCalledWith(
        ['/responder-access/search/evacuee/search-results'],
        Object({ skipLocationChange: true })
      );
    }
  ));

  it('should set paper form and navigate to search results page', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.paperBased
      };
      fixture.detectChanges();
      component.ngOnInit();
      component.nameSearchForm.get('firstName').setValue('EvacueeSearchTest');
      component.nameSearchForm.get('lastName').setValue('EvacueeSearchTest');
      component.nameSearchForm.get('dateOfBirth').setValue('11/11/2011');
      component.nameSearchForm.get('paperBasedEssFile').setValue('T123456');
      component.search();

      expect(router.navigate).toHaveBeenCalledWith(
        ['/responder-access/search/evacuee/search-results'],
        Object({ skipLocationChange: true })
      );
    }
  ));

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
