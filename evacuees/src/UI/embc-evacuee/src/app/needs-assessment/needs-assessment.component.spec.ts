import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedsAssessmentComponent } from './needs-assessment.component';

describe('EvacuationFileComponent', () => {
  let component: NeedsAssessmentComponent;
  let fixture: ComponentFixture<NeedsAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedsAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedsAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
