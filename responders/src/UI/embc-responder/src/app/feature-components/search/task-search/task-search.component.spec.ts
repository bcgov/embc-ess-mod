import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync
} from '@angular/core/testing';
import { TaskSearchComponent } from './task-search.component';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { Router } from '@angular/router';
import { TaskSearchService } from './task-search.service';
import { MockTaskSearchService } from 'src/app/unit-tests/mockTaskSearch.service';
import { MockAlertService } from 'src/app/unit-tests/mockAlert.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';

describe('TaskSearchComponent', () => {
  let component: TaskSearchComponent;
  let fixture: ComponentFixture<TaskSearchComponent>;
  let taskSearchService;
  let alertService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TaskSearchComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'responder-access/search/task-details',
            component: TaskDetailsComponent
          }
        ]),
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        TaskSearchComponent,
        {
          provide: TaskSearchService,
          useClass: MockTaskSearchService
        },
        {
          provide: AlertService,
          useClass: MockAlertService
        },
        UntypedFormBuilder
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSearchComponent);
    component = fixture.componentInstance;
    taskSearchService = TestBed.inject(TaskSearchService);
    alertService = TestBed.inject(AlertService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('it should have empty task number', () => {
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.taskSearchForm.get('taskNumber').value).toEqual('');
  });

  it('should navigate to task details with Active task', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();

      taskSearchService.mockEssTask = {
        communityCode: '9e6adfaf-9f97-ea11-b813-005056830319',
        communityName: 'Victoria',
        description: 'Portal Integration Test with Dynamics',
        endDate: '2022-09-08T18:53:00Z',
        id: 'UNIT-TEST-ACTIVE-TASK',
        startDate: '2021-05-12T21:31:00Z',
        status: 'Active'
      };

      const taskResult = {
        communityCode: '9e6adfaf-9f97-ea11-b813-005056830319',
        communityName: 'Victoria',
        description: 'Portal Integration Test with Dynamics',
        endDate: '2022-09-08T18:53:00Z',
        id: 'UNIT-TEST-ACTIVE-TASK',
        startDate: '2021-05-12T21:31:00Z',
        status: 'Active'
      };

      fixture.detectChanges();
      component.ngOnInit();
      component.submitTask();
      expect(router.navigate).toHaveBeenCalledWith(
        ['/responder-access/search/task-details'],
        { state: { essTask: taskResult } }
      );
    }
  ));

  it('should navigate to task details with Expired task', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();

      taskSearchService.mockEssTask = {
        communityCode: '986adfaf-9f97-ea11-b813-005056830319',
        communityName: 'Vancouver',
        description: 'DEV Task',
        endDate: '2021-12-03T03:32:00Z',
        id: '1234',
        startDate: '2021-11-29T19:32:00Z',
        status: 'Expired'
      };

      const taskResult = {
        communityCode: '986adfaf-9f97-ea11-b813-005056830319',
        communityName: 'Vancouver',
        description: 'DEV Task',
        endDate: '2021-12-03T03:32:00Z',
        id: '1234',
        startDate: '2021-11-29T19:32:00Z',
        status: 'Expired'
      };

      fixture.detectChanges();
      component.ngOnInit();
      component.submitTask();
      expect(router.navigate).toHaveBeenCalledWith(
        ['/responder-access/search/task-details'],
        { state: { essTask: taskResult } }
      );
    }
  ));

  it('should navigate to task details with Invalid task', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();

      taskSearchService.mockEssTask = {
        id: 'Invalid Task ID',
        status: 'Invalid'
      };

      const taskResult = {
        id: 'Invalid Task ID',
        status: 'Invalid'
      };

      fixture.detectChanges();
      component.ngOnInit();
      component.submitTask();
      expect(router.navigate).toHaveBeenCalledWith(
        ['/responder-access/search/task-details'],
        { state: { essTask: taskResult } }
      );
    }
  ));

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
