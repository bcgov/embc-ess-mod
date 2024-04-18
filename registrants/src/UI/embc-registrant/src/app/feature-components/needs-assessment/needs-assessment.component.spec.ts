import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NeedsAssessmentComponent } from './needs-assessment.component';
import { ComponentCreationService } from '../../core/services/componentCreation.service';
import { FormCreationService } from '../../core/services/formCreation.service';
import { provideRouter } from '@angular/router';

describe('NeedsAssessmentComponent', () => {
  let component: NeedsAssessmentComponent;
  let fixture: ComponentFixture<NeedsAssessmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NeedsAssessmentComponent],
      providers: [ComponentCreationService, FormCreationService, provideRouter([])]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedsAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
