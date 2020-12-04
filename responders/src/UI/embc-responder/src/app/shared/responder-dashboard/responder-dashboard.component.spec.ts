import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponderDashboardComponent } from './responder-dashboard.component';

describe('ResponderDashboardComponent', () => {
  let component: ResponderDashboardComponent;
  let fixture: ComponentFixture<ResponderDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponderDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponderDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
