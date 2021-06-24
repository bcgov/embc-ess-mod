import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssfileDashboardComponent } from './essfile-dashboard.component';

describe('EssfileDashboardComponent', () => {
  let component: EssfileDashboardComponent;
  let fixture: ComponentFixture<EssfileDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EssfileDashboardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssfileDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
