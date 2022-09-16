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

import { EvacueeProfileDashboardComponent } from './evacuee-profile-dashboard.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { EvacueeSearchService } from '../evacuee-search/evacuee-search.service';
import { MockEvacueeSearchService } from 'src/app/unit-tests/mockEvacueeSearch.service';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { MockEvacueeProfileService } from 'src/app/unit-tests/mockEvacueeProfile.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { computeInterfaceToken } from 'src/app/app.module';
import { ReactiveFormsModule } from '@angular/forms';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { MockOptionInjectionService } from 'src/app/unit-tests/mockOptionInjection.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { MockAppBaseService } from 'src/app/unit-tests/mockAppBase.service';
import { SelectedPathType } from 'src/app/core/models/appBase.model';
import { EvacueeProfileDashboardService } from './evacuee-profile-dashboard.service';
import { Router } from '@angular/router';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { MockEvacueeProfileDashboardService } from 'src/app/unit-tests/mockEvacueeProfileDashboard.service';

describe('EvacueeProfileDashboardComponent', () => {
  let component: EvacueeProfileDashboardComponent;
  let fixture: ComponentFixture<EvacueeProfileDashboardComponent>;
  let evacueeSearchService;
  let evacueeProfileService;
  let appBaseService;
  let injectionService;
  let profileDashboardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        CustomPipeModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [EvacueeProfileDashboardComponent],
      providers: [
        EvacueeProfileDashboardComponent,
        {
          provide: EvacueeProfileDashboardService,
          useClass: MockEvacueeProfileDashboardService
        },
        {
          provide: EvacueeSearchService,
          useClass: MockEvacueeSearchService
        },
        {
          provide: EvacueeProfileService,
          useClass: MockEvacueeProfileService
        },
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: AppBaseService,
          useClass: MockAppBaseService
        },
        {
          provide: OptionInjectionService,
          useClass: MockOptionInjectionService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacueeProfileDashboardComponent);
    component = fixture.componentInstance;
    evacueeSearchService = TestBed.inject(EvacueeSearchService);
    evacueeProfileService = TestBed.inject(EvacueeProfileService);
    appBaseService = TestBed.inject(AppBaseService);
    injectionService = TestBed.inject(OptionInjectionService);
    profileDashboardService = TestBed.inject(EvacueeProfileDashboardService);
  });

  it('should create', () => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.digital
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should navigate to New ESS File Wizard for digital flow', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.digital
      };

      fixture.detectChanges();
      component.ngOnInit();
      component.createNewESSFile();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalledWith(['/ess-wizard'], {
        queryParams: { type: WizardType.NewEssFile },
        queryParamsHandling: 'merge'
      });
    })
  ));

  it('should NOT allow new ess file if paper file already exists', fakeAsync(
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
      component.createNewESSFile();

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

  it('should allow new ess file if paper file does not exist', fakeAsync(
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
      component.createNewESSFile();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith(['/ess-wizard'], {
        queryParams: { type: WizardType.NewEssFile },
        queryParamsHandling: 'merge'
      });
    })
  ));

  it('should navigate to Edit Profile Wizard', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.digital
      };

      fixture.detectChanges();
      component.ngOnInit();
      component.editProfile();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalledWith(['/ess-wizard'], {
        queryParams: { type: WizardType.EditRegistration },
        queryParamsHandling: 'merge'
      });
    })
  ));

  it('should open dialog complete profile for paper profile on digital flow', fakeAsync(() => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.digital
    };

    appBaseService.appModel = {
      selectedProfile: { selectedEvacueeInContext: { id: 'bcd' } }
    };
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();
    fixture.detectChanges();

    const dialogContent = document.getElementsByTagName(
      'app-information-dialog'
    )[0] as HTMLElement;
    expect(dialogContent.textContent).toEqual(
      'Please complete the evacuee profile. Close '
    );
  }));

  it('should open dialog ess file successfully linked', fakeAsync(() => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.digital
    };

    appBaseService.appModel = {
      selectedProfile: { selectedEvacueeInContext: { id: 'bcd' } }
    };

    profileDashboardService.fileLinkStatus = 'S';
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();
    fixture.detectChanges();

    const dialogContent = document.getElementsByTagName(
      'app-information-dialog'
    )[0] as HTMLElement;

    expect(dialogContent.textContent).toEqual(
      'ESS File Successfully Linked Close '
    );
  }));

  it('should open dialog ess file error linked', fakeAsync(() => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.digital
    };

    appBaseService.appModel = {
      selectedProfile: { selectedEvacueeInContext: { id: 'bcd' } }
    };

    profileDashboardService.fileLinkStatus = 'E';
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();
    fixture.detectChanges();

    const dialogContent = document.getElementsByTagName(
      'app-information-dialog'
    )[0] as HTMLElement;
    expect(dialogContent.textContent).toEqual(
      'Error while linking the ESS File. Please try again later Close '
    );
  }));

  it('should open dialog to verify evacuee', fakeAsync(() => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.digital
    };

    appBaseService.appModel = {
      selectedProfile: { selectedEvacueeInContext: { id: 'bcd' } }
    };

    fixture.detectChanges();
    component.ngOnInit();
    component.verifyEvacuee();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();
    fixture.detectChanges();

    const dialogContent = document.getElementsByTagName(
      'app-verify-evacuee-dialog'
    )[0] as HTMLElement;
    expect(dialogContent.textContent).toBeTruthy();
  }));

  it('should verify evacuee', fakeAsync(() => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.digital
    };

    appBaseService.appModel = {
      selectedProfile: { selectedEvacueeInContext: { id: 'bcd' } }
    };

    evacueeProfileService.registrantProfileValue = {};

    fixture.detectChanges();
    component.ngOnInit();
    component.verifyEvacuee();
    profileDashboardService.closeVerifyDialog();
    fixture.detectChanges();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();

    fixture.detectChanges();

    const dialogContent = document.getElementsByTagName(
      'app-information-dialog'
    )[0] as HTMLElement;
    expect(dialogContent.textContent).toBeTruthy();
  }));

  it('should not verify evacuee if the dialog closes incomplete', fakeAsync(() => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.digital
    };

    appBaseService.appModel = {
      selectedProfile: { selectedEvacueeInContext: { id: 'bcd' } }
    };

    evacueeProfileService.registrantProfileValue = {};

    fixture.detectChanges();
    component.ngOnInit();
    component.verifyEvacuee();
    profileDashboardService.closeUnVerifiedDialog();
    fixture.detectChanges();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();

    fixture.detectChanges();

    const dialogContent = document.getElementsByTagName(
      'app-information-dialog'
    )[0] as HTMLElement;
    expect(dialogContent.textContent).not.toBe(
      'Evacuee profile has been successfully verified.'
    );
  }));

  it('should open bc services card invite dialog', fakeAsync(() => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.digital
    };

    appBaseService.appModel = {
      selectedProfile: {
        selectedEvacueeInContext: {
          id: 'bcd',
          contactDetails: { email: 'unit@test.com' }
        }
      }
    };

    fixture.detectChanges();
    component.ngOnInit();
    component.sendEmail();
    fixture.detectChanges();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();

    fixture.detectChanges();

    const dialogContent = document.getElementsByTagName(
      'app-bcsc-invite-dialog'
    )[0] as HTMLElement;
    expect(dialogContent.textContent).toBeTruthy();
  }));

  it('should send bc services card invitation', fakeAsync(() => {
    appBaseService.appModel = {
      selectedUserPathway: SelectedPathType.digital
    };

    appBaseService.appModel = {
      selectedProfile: {
        selectedEvacueeInContext: {
          id: 'bcd',
          contactDetails: { email: 'unit@test.com' }
        }
      }
    };

    fixture.detectChanges();
    component.ngOnInit();
    component.sendEmail();
    profileDashboardService.closeEmailInviteDialog();
    fixture.detectChanges();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();

    fixture.detectChanges();

    expect(component.emailSuccessMessage).toBe(
      'Email sent successfully to unit@test.com'
    );
  }));
});
