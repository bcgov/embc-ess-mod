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
import { ExistingSupportDetailsComponent } from './existing-support-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { DatePipe } from '@angular/common';
import { StepSupportsService } from '../../step-supports/step-supports.service';
import { MockStepSupportsService } from 'src/app/unit-tests/mockStepSupport.service';
import { StepEssFileService } from '../../step-ess-file/step-ess-file.service';
import { MockStepEssFileService } from 'src/app/unit-tests/mockStepEssFile.service';
import { ExistingSupportDetailsService } from './existing-support-details.service';
import { ReferralCreationService } from '../../step-supports/referral-creation.service';
import { LoadEvacueeListService } from 'src/app/core/services/load-evacuee-list.service';
import { MockEvacueeListService } from 'src/app/unit-tests/mockEvacueeList.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewSupportsComponent } from '../view-supports/view-supports.component';
import { Router } from '@angular/router';
import { SupportDetailsComponent } from '../support-details/support-details.component';
import { computeInterfaceToken } from 'src/app/app.module';

describe('ExistingSupportDetailsComponent', () => {
  let component: ExistingSupportDetailsComponent;
  let fixture: ComponentFixture<ExistingSupportDetailsComponent>;
  let stepSupportsService;
  let stepEssFileService;
  let loadEvacueeListService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        BrowserAnimationsModule,
        CustomPipeModule,
        SharedModule,
        RouterTestingModule.withRoutes([
          {
            path: 'ess-wizard/add-supports/details',
            component: SupportDetailsComponent
          }
        ])
      ],
      declarations: [ExistingSupportDetailsComponent],
      providers: [
        ExistingSupportDetailsComponent,
        DatePipe,
        {
          provide: StepSupportsService,
          useClass: MockStepSupportsService
        },
        {
          provide: StepEssFileService,
          useClass: MockStepEssFileService
        },
        {
          provide: LoadEvacueeListService,
          useClass: MockEvacueeListService
        },
        { provide: computeInterfaceToken, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingSupportDetailsComponent);
    component = fixture.componentInstance;
    stepSupportsService = TestBed.inject(StepSupportsService);
    stepEssFileService = TestBed.inject(StepEssFileService);
    loadEvacueeListService = TestBed.inject(LoadEvacueeListService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get selected Support', () => {
    stepEssFileService.selectedEssFile = stepEssFileService.essFile;
    stepSupportsService.selectedSupportDetail =
      stepSupportsService.selectedSupport;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.selectedSupport).toBeDefined();
  });

  it('should get selected ESSFile', () => {
    stepEssFileService.selectedEssFile = stepEssFileService.essFile;
    stepSupportsService.selectedSupportDetail =
      stepSupportsService.selectedSupport;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.needsAssessmentForSupport).toBeDefined();
  });

  it('should get support Type', () => {
    stepEssFileService.selectedEssFile = stepEssFileService.essFile;
    stepSupportsService.selectedSupportDetail =
      stepSupportsService.selectedSupport;
    fixture.detectChanges();
    const supportType = component.generateSupportType(
      component.selectedSupport
    );
    expect(supportType).toEqual('Food - Groceries');
  });

  it('should get need assessment Dialog', fakeAsync(() => {
    stepEssFileService.selectedEssFile = stepEssFileService.essFile;
    stepSupportsService.selectedSupportDetail =
      stepSupportsService.selectedSupport;
    stepSupportsService.evacuationFileValue = stepEssFileService.essFile;

    fixture.detectChanges();
    component.ngOnInit();
    component.openAssessment();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();

    const viewNeedsAssessDialog = document.getElementsByTagName(
      'app-view-assessment-dialog'
    )[0] as HTMLElement;

    expect(viewNeedsAssessDialog).toBeDefined();
  }));

  it('should navigate to view support after delete referral', () => {
    stepEssFileService.selectedEssFile = stepEssFileService.essFile;
    stepSupportsService.selectedSupportDetail =
      stepSupportsService.selectedSupport;
    stepSupportsService.evacuationFileValue = stepEssFileService.essFile;

    fixture.detectChanges();
    component.ngOnInit();
    component.voidReferral();
    fixture.detectChanges();

    const voidReferralDialog = document.getElementsByTagName(
      'app-void-referral-dialog'
    )[0] as HTMLElement;

    // const reasonSelector = voidReferralDialog.querySelector(
    //   'mat-select'
    // ) as HTMLSelectElement;
    // reasonSelector.value = 'ErrorOnPrintedReferral';

    // const voidBttn = voidReferralDialog.querySelector(
    //   '#voidButton'
    // ) as HTMLButtonElement;
    // voidBttn.click();

    // fixture.detectChanges();

    expect(voidReferralDialog).toBeDefined();
  });

  it('should navigate to supports details', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();

      stepEssFileService.selectedEssFile = stepEssFileService.essFile;
      stepSupportsService.selectedSupportDetail =
        stepSupportsService.selectedSupport;

      fixture.detectChanges();
      component.ngOnInit();
      component.editDraft();

      expect(router.navigate).toHaveBeenCalledWith(
        ['/ess-wizard/add-supports/details'],
        {
          state: { action: 'edit' }
        }
      );
    }
  ));

  it('should get status description', () => {
    stepEssFileService.selectedEssFile = stepEssFileService.essFile;
    stepSupportsService.selectedSupportDetail =
      stepSupportsService.selectedSupport;
    fixture.detectChanges();
    const statusDescription = component.getStatusTextToDisplay(
      component.selectedSupport.status
    );
    expect(statusDescription).toEqual('Active');
  });

  it('should get method description', () => {
    stepEssFileService.selectedEssFile = stepEssFileService.essFile;
    stepSupportsService.selectedSupportDetail =
      stepSupportsService.selectedSupport;
    fixture.detectChanges();
    const methodDescription = component.getMethodTextToDisplay(
      component.selectedSupport.method
    );
    expect(methodDescription).toEqual('Referral');
  });
});
