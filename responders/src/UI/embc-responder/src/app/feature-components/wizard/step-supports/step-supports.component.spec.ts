import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepSupportsComponent } from './step-supports.component';

describe('StepSupportsComponent', () => {
  let component: StepSupportsComponent;
  let fixture: ComponentFixture<StepSupportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepSupportsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepSupportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
