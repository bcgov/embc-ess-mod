import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssfileDashboardComponent } from './essfile-dashboard.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EssfileDashboardComponent', () => {
  let component: EssfileDashboardComponent;
  let fixture: ComponentFixture<EssfileDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, RouterTestingModule, HttpClientTestingModule],
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
