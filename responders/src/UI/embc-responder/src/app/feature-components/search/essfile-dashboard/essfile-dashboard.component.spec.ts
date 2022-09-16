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

import { EssfileDashboardComponent } from './essfile-dashboard.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { computeInterfaceToken } from 'src/app/app.module';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { MockOptionInjectionService } from 'src/app/unit-tests/mockOptionInjection.service';
import { ReactiveFormsModule } from '@angular/forms';
import { EssfileDashboardService } from './essfile-dashboard.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { MockAppBaseService } from 'src/app/unit-tests/mockAppBase.service';
import { MockEssfileDashboardService } from 'src/app/unit-tests/mockEssfileDashboard.service';
import { Router } from '@angular/router';
import { SelectedPathType } from 'src/app/core/models/appBase.model';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { EvacuationFileStatus } from 'src/app/core/api/models';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EssfileDashboardComponent', () => {
  let component: EssfileDashboardComponent;
  let fixture: ComponentFixture<EssfileDashboardComponent>;
  let evacueeFileService;
  let appBaseService;
  let injectionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [EssfileDashboardComponent],
      providers: [
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: OptionInjectionService,
          useClass: MockOptionInjectionService
        },
        {
          provide: EssfileDashboardService,
          useClass: MockEssfileDashboardService
        },
        {
          provide: AppBaseService,
          useClass: MockAppBaseService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssfileDashboardComponent);
    component = fixture.componentInstance;
    evacueeFileService = TestBed.inject(EssfileDashboardService);
    appBaseService = TestBed.inject(AppBaseService);
    injectionService = TestBed.inject(OptionInjectionService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show extend support banner for Remote extensions', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.remoteExtensions
      };
      appBaseService.fileStatus = EvacuationFileStatus.Active;

      fixture.detectChanges();
      component.ngOnInit();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();
      const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
      const labelElem = nativeElem.querySelector('#file-banner');
      expect(labelElem.textContent).toEqual(
        'Extend Supports associated with the Current ESS File.'
      );
    })
  ));

  it('should open Extend Supports wizard for Remote Extenions', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.remoteExtensions
      };
      appBaseService.fileStatus = EvacuationFileStatus.Active;

      fixture.detectChanges();
      component.ngOnInit();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      component.openWizard();
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalledWith(['/ess-wizard'], {
        queryParams: { type: WizardType.ExtendSupports },
        queryParamsHandling: 'merge'
      });
    })
  ));

  it('should open edit ess file for Digital flow', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.digital
      };

      fixture.detectChanges();
      component.ngOnInit();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      component.openWizard();
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalledWith(['/ess-wizard'], {
        queryParams: { type: WizardType.ReviewFile },
        queryParamsHandling: 'merge'
      });
    })
  ));

  it('should show Active file banner for digital flow', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.digital
      };
      appBaseService.fileStatus = EvacuationFileStatus.Active;

      fixture.detectChanges();
      component.ngOnInit();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();
      const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
      const labelElem = nativeElem.querySelector('#file-banner');

      expect(labelElem.textContent).toEqual(
        'Review, extend or add new supports to the current ESS File.'
      );
    })
  ));

  it('should show Pending file banner for digital flow', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.digital
      };
      appBaseService.fileStatus = EvacuationFileStatus.Pending;

      fixture.detectChanges();
      component.ngOnInit();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();
      const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
      const labelElem = nativeElem.querySelector('#file-banner');

      expect(labelElem.textContent).toEqual(
        'Complete ESS File and add supports if required.'
      );
    })
  ));

  it('should show Expired file banner for digital flow', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.digital
      };
      appBaseService.fileStatus = EvacuationFileStatus.Expired;

      fixture.detectChanges();
      component.ngOnInit();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();
      const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
      const labelElem = nativeElem.querySelector('#file-banner');

      expect(labelElem.textContent).toEqual(
        'Reactivate and complete ESS File and add supports if required.'
      );
    })
  ));

  it('should show Completed file banner for digital flow', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.digital
      };
      appBaseService.fileStatus = EvacuationFileStatus.Completed;

      fixture.detectChanges();
      component.ngOnInit();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();
      const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
      const labelElem = nativeElem.querySelector('#file-banner');

      expect(labelElem.textContent).toEqual(
        'Task number end date has expired and ESS File is closed. To extend or to add new supports, task number must be extended.'
      );
    })
  ));

  it('should show Completed file banner for Paper flow', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.paperBased
      };
      appBaseService.fileStatus = EvacuationFileStatus.Completed;

      fixture.detectChanges();
      component.ngOnInit();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();
      const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
      const labelElem = nativeElem.querySelector('#file-banner');

      expect(labelElem.textContent).toEqual(
        'Task number end date has expired and ESS File is closed.'
      );
    })
  ));

  it('should open status definition', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.digital
      };

      fixture.detectChanges();
      component.ngOnInit();
      component.openStatusDefinition();

      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      fixture.detectChanges();
      const dialogContent = document.getElementsByTagName(
        'app-file-status-definition'
      )[0] as HTMLElement;

      expect(dialogContent).toBeDefined();
    })
  ));

  it('should open dialog profile linked successfully', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.digital
      };

      evacueeFileService.fileLinkStatus = 'S';
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
        'Profile Successfully Linked Close '
      );
    })
  ));

  it('should open dialog profile linking error', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.digital
      };

      evacueeFileService.fileLinkStatus = 'E';
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
        'Error while linking the profile. Please try again later Close '
      );
    })
  ));
});
