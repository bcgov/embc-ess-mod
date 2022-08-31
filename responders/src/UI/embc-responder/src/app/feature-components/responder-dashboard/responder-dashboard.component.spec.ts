import {
  ComponentFixture,
  TestBed,
  waitForAsync,
  inject
} from '@angular/core/testing';

import { ResponderDashboardComponent } from './responder-dashboard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { MockUserService } from 'src/app/unit-tests/mockUser.service';
import { TaskSearchComponent } from '../search/task-search/task-search.component';
import { EvacueeSearchComponent } from '../search/evacuee-search/evacuee-search.component';

describe('ResponderDashboardComponent', () => {
  let component: ResponderDashboardComponent;
  let fixture: ComponentFixture<ResponderDashboardComponent>;
  let userService;
  // const routerMock = {
  //   navigate: jasmine.createSpy('navigate')
  // };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ResponderDashboardComponent],
      imports: [
        RouterTestingModule.withRoutes([
          // {
          //   path: 'responder-access/search',
          //   component: TaskSearchComponent
          // }
          // {
          //   path: 'responder-access/search/evacuee',
          //   component: EvacueeSearchComponent
          // }
        ]),
        HttpClientTestingModule
      ],
      providers: [
        ResponderDashboardComponent,
        //{ provide: Router, useValue: routerMock },
        {
          provide: UserService,
          useClass: MockUserService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponderDashboardComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    userService.currentProfileValue = {
      agreementSignDate: null,
      firstName: 'Test_First_Name',
      lastName: 'Test_Last_Name',
      requiredToSignAgreement: false,
      userName: 'Test_User',
      taskNumber: 'Test',
      taskStatus: 'Active'
    };
  });

  it('should create the app', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // it('should navigate to task search page', inject(
  //   [Router],
  //   (router: Router) => {
  //     spyOn(router, 'navigate').and.stub();

  //     fixture.detectChanges();
  //     component.signinTask();
  //     expect(router.navigate).toHaveBeenCalledWith([
  //       '/responder-access/search'
  //     ]);
  //   }
  // ));

  // it('should navigate to evacuee search page', inject(
  //   [Router],
  //   (router: Router) => {
  //     spyOn(router, 'navigate').and.stub();

  //     fixture.detectChanges();
  //     component.evacueeSearch();
  //     expect(router.navigate).toHaveBeenCalledWith([
  //       '/responder-access/search/evacuee'
  //     ]);
  //   }
  // ));

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
