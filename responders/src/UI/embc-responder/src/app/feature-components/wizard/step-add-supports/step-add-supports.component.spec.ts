import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepAddSupportsComponent } from './step-add-supports.component';

describe('StepAddSupportsComponent', () => {
  let component: StepAddSupportsComponent;
  let fixture: ComponentFixture<StepAddSupportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepAddSupportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepAddSupportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
