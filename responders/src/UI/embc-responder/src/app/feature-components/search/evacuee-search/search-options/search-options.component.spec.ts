import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { computeInterfaceToken } from 'src/app/app.module';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { UserService } from 'src/app/core/services/user.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { MockAppBaseService } from 'src/app/unit-tests/mockAppBase.service';
import { SearchOptionsComponent } from './search-options.component';
import { MockEvacueeSessionService } from 'src/app/unit-tests/mockEvacueeSession.service';
import { Router } from '@angular/router';
import { SelectedPathType } from 'src/app/core/models/appBase.model';

describe('SearchOptionsComponent', () => {
  let component: SearchOptionsComponent;
  let fixture: ComponentFixture<SearchOptionsComponent>;
  let appBaseService;
  let evacueeSessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [SearchOptionsComponent],
      providers: [
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: AppBaseService,
          useClass: MockAppBaseService
        },
        {
          provide: EvacueeSessionService,
          useClass: MockEvacueeSessionService
        },
        UserService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchOptionsComponent);
    component = fixture.componentInstance;
    appBaseService = TestBed.inject(AppBaseService);
    evacueeSessionService = TestBed.inject(EvacueeSessionService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show Paper Based option only', () => {
    appBaseService.appModel = {
      selectedEssTask: appBaseService.enabledPaperBasedWorkflowTask
    };
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.selectedPathway).toEqual(SelectedPathType.paperBased);
  });

  it('should navigate to the wrapper component', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();

      component.setSelection('digital');

      fixture.detectChanges();
      component.next();
      expect(router.navigate).toHaveBeenCalledWith(
        ['/responder-access/search/evacuee/wrapper'],
        Object({ skipLocationChange: true })
      );
    }
  ));

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
