import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponderDashboardComponent } from './responder-dashboard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ResponderDashboardComponent', () => {
  let component: ResponderDashboardComponent;
  let fixture: ComponentFixture<ResponderDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponderDashboardComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponderDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
