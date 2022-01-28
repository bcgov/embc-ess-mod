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
import { UserService } from 'src/app/core/services/user.service';
import { WizardComponent } from 'src/app/feature-components/wizard/wizard.component';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { EvacueeSearchService } from '../evacuee-search.service';
import { MockEvacueeSessionService } from 'src/app/unit-tests/mockEvacueeSession.service';
import { MockEvacueeSearchService } from 'src/app/unit-tests/mockEvacueeSearch.service';
import { MockUserService } from 'src/app/unit-tests/mockUser.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { MockAlertService } from 'src/app/unit-tests/mockAlert.service';
import { Router } from '@angular/router';
import { WizardType } from 'src/app/core/models/wizard-type.model';

describe('EvacueeSearchResultsComponent', () => {
  let component: EvacueeSearchResultsComponent;
  let fixture: ComponentFixture<EvacueeSearchResultsComponent>;
  let evacueeSessionService;
  let evacueeSearchService;
  let userService;
  let alertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvacueeSearchResultsComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        RouterTestingModule.withRoutes([
          { path: 'wizard', component: WizardComponent }
        ])
      ],
      providers: [
        EvacueeSearchResultsComponent,
        { provide: EvacueeSessionService, useClass: MockEvacueeSessionService },
        { provide: EvacueeSearchService, useClass: MockEvacueeSearchService },
        { provide: UserService, useClass: MockUserService },
        { provide: AlertService, useClass: MockAlertService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacueeSearchResultsComponent);
    component = fixture.componentInstance;
    evacueeSessionService = TestBed.inject(EvacueeSessionService);
    evacueeSearchService = TestBed.inject(EvacueeSearchService);
    userService = TestBed.inject(UserService);
    alertService = TestBed.inject(AlertService);

    const evacueeSearchDetails = {
      firstName: 'Evac',
      lastName: 'Five',
      dateOfBirth: '12/12/2000'
    };
    evacueeSearchService.evacueeSearchContext = {
      hasShownIdentification: true,
      evacueeSearchParameters: evacueeSearchDetails
    };
  });

  it('should create', () => {
    fixture.detectChanges();
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should get paper based true from service', () => {
    evacueeSessionService.paperBased = true;
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.isPaperBased).toEqual(true);
  });

  it('should get paper based false from service', () => {
    evacueeSessionService.paperBased = false;
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.isPaperBased).toEqual(false);
  });

  it('should appear paper based search results title', fakeAsync(() => {
    evacueeSessionService.paperBased = true;
    evacueeSearchService.paperBasedEssFile = 'T123456';
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const titleElem = nativeElem.querySelector('.result-text');

    expect(titleElem.textContent).toEqual(
      ' Results for "FIVE, Evac" with a date of birth "12-Dec-2000" and a paper ESS File # T123456.'
    );
  }));

  it('should appear digital based search results title', fakeAsync(() => {
    evacueeSessionService.paperBased = false;
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const titleElem = nativeElem.querySelector('.result-text');

    expect(titleElem.textContent).toEqual(
      ' Results for "FIVE, Evac" with a date of birth "12-Dec-2000".'
    );
  }));

  it('should navigate to Wizard', inject([Router], (router: Router) => {
    spyOn(router, 'navigate').and.stub();

    fixture.detectChanges();
    component.ngOnInit();
    component.openWizard();

    expect(router.navigate).toHaveBeenCalledWith(['/ess-wizard'], {
      queryParams: { type: WizardType.NewRegistration },
      queryParamsHandling: 'merge'
    });
  }));
});
