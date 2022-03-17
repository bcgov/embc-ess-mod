import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NeedsAssessmentComponent } from './needs-assessment.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentCreationService } from '../../core/services/componentCreation.service';
import { FormCreationService } from '../../core/services/formCreation.service';

describe('NeedsAssessmentComponent', () => {
  let component: NeedsAssessmentComponent;
  let fixture: ComponentFixture<NeedsAssessmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NeedsAssessmentComponent],
      imports: [RouterTestingModule],
      providers: [ComponentCreationService, FormCreationService]
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
