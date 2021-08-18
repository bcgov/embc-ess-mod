import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportDetailsComponent } from './support-details.component';

describe('SupportDetailsComponent', () => {
  let component: SupportDetailsComponent;
  let fixture: ComponentFixture<SupportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupportDetailsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
