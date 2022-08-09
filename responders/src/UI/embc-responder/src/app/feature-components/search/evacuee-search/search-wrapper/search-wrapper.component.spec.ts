import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { MockOptionInjectionService } from 'src/app/unit-tests/mockOptionInjection.service';
import { SearchWrapperComponent } from './search-wrapper.component';
import { computeInterfaceToken } from 'src/app/app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { MockAppBaseService } from 'src/app/unit-tests/mockAppBase.service';
import { SelectedPathType } from 'src/app/core/models/appBase.model';

describe('SearchWrapperComponent', () => {
  let component: SearchWrapperComponent;
  let fixture: ComponentFixture<SearchWrapperComponent>;
  let optionInjectionService;
  let appBaseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      declarations: [SearchWrapperComponent],
      providers: [
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: OptionInjectionService,
          useClass: MockOptionInjectionService
        },
        {
          provide: AppBaseService,
          useClass: MockAppBaseService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchWrapperComponent);
    component = fixture.componentInstance;
    optionInjectionService = TestBed.inject(OptionInjectionService);
    appBaseService = TestBed.inject(AppBaseService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should navigate to the digital path', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();

      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.digital
      };

      fixture.detectChanges();
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(
        ['/responder-access/search/evacuee/id-search'],
        Object({ skipLocationChange: true })
      );
    }
  ));

  it('should navigate to paper based path', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();

      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.paperBased
      };

      fixture.detectChanges();
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(
        ['/responder-access/search/evacuee/id-search'],
        Object({ skipLocationChange: true })
      );
    }
  ));

  it('should navigate to remote extension path', inject(
    [Router],
    (router: Router) => {
      spyOn(router, 'navigate').and.stub();

      appBaseService.appModel = {
        selectedUserPathway: SelectedPathType.remoteExtensions
      };

      fixture.detectChanges();
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(
        ['/responder-access/search/evacuee/remote-search'],
        Object({ skipLocationChange: true })
      );
    }
  ));

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
