import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { TaskDetailsComponent } from './task-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { computeInterfaceToken } from 'src/app/app.module';
import { TaskSearchService } from '../task-search.service';
import { MockTaskSearchService } from 'src/app/unit-tests/mockTaskSearch.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { MockAlertService } from 'src/app/unit-tests/mockAlert.service';
import { Router } from '@angular/router';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { MockAppBaseService } from 'src/app/unit-tests/mockAppBase.service';

describe('TaskDetailsComponent', () => {
  let component: TaskDetailsComponent;
  let fixture: ComponentFixture<TaskDetailsComponent>;
  let taskSearchService;
  let alertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskDetailsComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: TaskSearchService,
          useClass: MockTaskSearchService
        },
        {
          provide: AlertService,
          useClass: MockAlertService
        },
        {
          provide: AppBaseService,
          useClass: MockAppBaseService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailsComponent);
    component = fixture.componentInstance;
    taskSearchService = TestBed.inject(TaskSearchService);
    alertService = TestBed.inject(AlertService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sign into task', inject([Router], (router: Router) => {
    spyOn(router, 'navigate').and.stub();

    fixture.detectChanges();
    component.ngOnInit();
    component.signInTask();
    expect(router.navigate).toHaveBeenCalled();
  }));

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
