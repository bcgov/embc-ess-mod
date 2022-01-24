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
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { MockEvacueeSearchService } from 'src/app/unit-tests/mockEvacueeSearch.service';
import { MockEvacueeSessionService } from 'src/app/unit-tests/mockEvacueeSession.service';
import { EvacueeSearchComponent } from '../evacuee-search.component';
import { EvacueeSearchService } from '../evacuee-search.service';

import { EvacueeNameSearchComponent } from './evacuee-name-search.component';

describe('EvacueeNameSearchComponent', () => {
  let component: EvacueeNameSearchComponent;
  let fixture: ComponentFixture<EvacueeNameSearchComponent>;
  let evacueeSessionService;
  let evacueeSearchService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvacueeNameSearchComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        // RouterTestingModule
        RouterTestingModule.withRoutes([
          { path: 'evacuee', component: EvacueeSearchComponent }
        ])
      ],
      providers: [
        EvacueeNameSearchComponent,
        FormBuilder,
        { provide: EvacueeSessionService, useClass: MockEvacueeSessionService },
        { provide: EvacueeSearchService, useClass: MockEvacueeSearchService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacueeNameSearchComponent);
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

  it('should appear ESSFile Paper based field', fakeAsync(() => {
    evacueeSessionService.paperBased = true;
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

  it('should not appear ESSFile Paper based field', fakeAsync(() => {
    evacueeSessionService.paperBased = false;
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

  it('should get first name from form', () => {
    evacueeSessionService.paperBased = false;
    fixture.detectChanges();
    component.ngOnInit();
    component.nameSearchForm.get('firstName').setValue('EvacueeSearchTest');
    component.search();

    expect(
      evacueeSearchService.evacueeSearchContext.evacueeSearchParameters
        .firstName
    ).toEqual('EvacueeSearchTest');
  });

  it('should get last name from form', () => {
    evacueeSessionService.paperBased = false;
    fixture.detectChanges();
    component.ngOnInit();
    component.nameSearchForm.get('lastName').setValue('EvacueeSearchTest');
    component.search();

    expect(
      evacueeSearchService.evacueeSearchContext.evacueeSearchParameters.lastName
    ).toEqual('EvacueeSearchTest');
  });

  it('should get date of birth from form', () => {
    evacueeSessionService.paperBased = false;
    fixture.detectChanges();
    component.ngOnInit();
    component.nameSearchForm.get('dateOfBirth').setValue('11/11/2011');
    component.search();

    expect(
      evacueeSearchService.evacueeSearchContext.evacueeSearchParameters
        .dateOfBirth
    ).toEqual('11/11/2011');
  });

  it('should get paper based EssFile #', () => {
    evacueeSessionService.paperBased = true;
    fixture.detectChanges();
    component.ngOnInit();
    component.nameSearchForm.get('paperBasedEssFile').setValue('T123456');
    component.search();

    expect(evacueeSearchService.paperBasedEssFile).toEqual('T123456');
  });

  it('should navigate to Evacuee Result if digital based form is correct', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      evacueeSessionService.paperBased = false;

      fixture.detectChanges();
      component.ngOnInit();

      component.nameSearchForm.get('firstName').setValue('EvacueeSearchTest');
      component.nameSearchForm.get('lastName').setValue('EvacueeSearchTest');
      component.nameSearchForm.get('dateOfBirth').setValue('11/11/2011');

      component.search();

      expect(router.navigate).toHaveBeenCalledWith([
        '/responder-access/search/evacuee'
      ]);
    }
  ));

  it('should navigate to Evacuee Result if paper based form is correct', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      evacueeSessionService.paperBased = true;

      fixture.detectChanges();
      component.ngOnInit();

      component.nameSearchForm.get('firstName').setValue('EvacueeSearchTest');
      component.nameSearchForm.get('lastName').setValue('EvacueeSearchTest');
      component.nameSearchForm.get('dateOfBirth').setValue('11/11/2011');
      component.nameSearchForm.get('paperBasedEssFile').setValue('T123456');

      component.search();

      expect(router.navigate).toHaveBeenCalledWith([
        '/responder-access/search/evacuee'
      ]);
    }
  ));
});
