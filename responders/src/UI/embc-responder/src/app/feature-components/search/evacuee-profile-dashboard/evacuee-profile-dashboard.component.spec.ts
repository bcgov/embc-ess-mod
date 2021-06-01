import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvacueeProfileDashboardComponent } from './evacuee-profile-dashboard.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('EvacueeProfileDashboardComponent', () => {
  let component: EvacueeProfileDashboardComponent;
  let fixture: ComponentFixture<EvacueeProfileDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [EvacueeProfileDashboardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacueeProfileDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
