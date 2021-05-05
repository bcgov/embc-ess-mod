import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepCreateEssFileComponent } from './step-create-ess-file.component';

describe('StepCreateEssFileComponent', () => {
  let component: StepCreateEssFileComponent;
  let fixture: ComponentFixture<StepCreateEssFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepCreateEssFileComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepCreateEssFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
