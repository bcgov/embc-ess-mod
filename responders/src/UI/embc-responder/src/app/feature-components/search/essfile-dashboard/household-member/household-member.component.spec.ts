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

import { HouseholdMemberComponent } from './household-member.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { computeInterfaceToken } from 'src/app/app.module';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { MockOptionInjectionService } from 'src/app/unit-tests/mockOptionInjection.service';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HouseholdMemberService } from './household-member.service';
import { EssfileDashboardService } from '../essfile-dashboard.service';
import { MockEssfileDashboardService } from 'src/app/unit-tests/mockEssfileDashboard.service';
import { MockHouseholdMemberService } from 'src/app/unit-tests/mockHouseholdMember.service';
import { Router } from '@angular/router';
import { WizardType } from 'src/app/core/models/wizard-type.model';

describe('HouseholdMemberComponent', () => {
  let component: HouseholdMemberComponent;
  let fixture: ComponentFixture<HouseholdMemberComponent>;
  let householdMemberService;
  let essfileDashboardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [HouseholdMemberComponent],
      providers: [
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: OptionInjectionService,
          useClass: MockOptionInjectionService
        },
        {
          provide: HouseholdMemberService,
          useClass: MockHouseholdMemberService
        },
        {
          provide: EssfileDashboardService,
          useClass: MockEssfileDashboardService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdMemberComponent);
    component = fixture.componentInstance;
    householdMemberService = TestBed.inject(HouseholdMemberService);
    essfileDashboardService = TestBed.inject(EssfileDashboardService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should open VIEW PROFILE dialog', fakeAsync(
    inject([Router], (router: Router) => {
      const memberDetails = householdMemberService.householdMemberValue1;
      fixture.detectChanges();
      component.viewProfile(memberDetails);

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();
      const dialogContent = document.getElementsByTagName(
        'app-file-dashboard-verify-dialog'
      )[0] as HTMLElement;
      expect(dialogContent).toBeDefined();
    })
  ));

  it('VIEW PROFILE - should route to profile dashboard if user showed government-id', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      const memberDetails = householdMemberService.householdMemberValue1;
      fixture.detectChanges();
      component.viewProfile(memberDetails);
      householdMemberService.closeYesViewMemberProfileDialog();
      fixture.detectChanges();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith([
        'responder-access/search/evacuee-profile-dashboard'
      ]);
    })
  ));

  it('VIEW PROFILE - should route to security questions if user did not show government-id', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      const memberDetails = householdMemberService.householdMemberValue1;
      fixture.detectChanges();
      component.viewProfile(memberDetails);
      householdMemberService.closeNoViewMemberProfileDialog();
      fixture.detectChanges();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith([
        'responder-access/search/security-questions'
      ]);
    })
  ));

  it('VIEW PROFILE - should route to profile dashboard if user answered security questions correctly', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      const memberDetails = householdMemberService.householdMemberValue1;
      fixture.detectChanges();
      component.viewProfile(memberDetails);
      householdMemberService.closeAnsweredViewMemberProfileDialog();
      fixture.detectChanges();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith([
        'responder-access/search/evacuee-profile-dashboard'
      ]);
    })
  ));

  it('should route to CREATE household member profile wizard', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      const memberDetails = householdMemberService.householdMemberValue1;
      fixture.detectChanges();
      component.createProfile(memberDetails);
      fixture.detectChanges();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith(['/ess-wizard'], {
        queryParams: { type: WizardType.MemberRegistration },
        queryParamsHandling: 'merge'
      });
    })
  ));

  it('LINK SINGLE PROFILE - should route to security questions', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      const memberDetails = householdMemberService.householdMemberValue1;
      component.essFile = householdMemberService.mockEssfile;
      essfileDashboardService.matchedProfiles =
        householdMemberService.singleMatchedProfile;
      fixture.detectChanges();
      component.linkToProfile(memberDetails);
      fixture.detectChanges();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith([
        'responder-access/search/security-questions'
      ]);
    })
  ));

  it('LINK MULTIPLE PROFILE - should open dialog with multiple profiles', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      const memberDetails = householdMemberService.householdMemberValue1;
      component.essFile = householdMemberService.mockEssfile;
      essfileDashboardService.matchedProfiles =
        householdMemberService.multipleMatchedProfile;
      fixture.detectChanges();
      component.linkToProfile(memberDetails);
      fixture.detectChanges();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();

      const dialogContent = document.getElementsByTagName(
        'app-registrant-link-dialog'
      )[0] as HTMLElement;
      expect(dialogContent).toBeDefined();
    })
  ));

  it('LINK MULTIPLE PROFILE - should route to security questions page for selected profile', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      const memberDetails = householdMemberService.householdMemberValue1;
      component.essFile = householdMemberService.mockEssfile;
      essfileDashboardService.matchedProfiles =
        householdMemberService.multipleMatchedProfile;
      fixture.detectChanges();

      component.linkToProfile(memberDetails);
      householdMemberService.closeMultipleMatchedRegistrantLink();
      fixture.detectChanges();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith([
        'responder-access/search/security-questions'
      ]);
    })
  ));
});
