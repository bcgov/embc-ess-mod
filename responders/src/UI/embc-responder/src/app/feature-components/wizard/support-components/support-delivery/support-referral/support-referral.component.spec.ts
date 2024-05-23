import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportReferralComponent } from './support-referral.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { UntypedFormBuilder } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { computeInterfaceToken } from 'src/app/app.module';
import { provideRouter } from '@angular/router';

describe('SupportReferralComponent', () => {
  let component: SupportReferralComponent;
  let fixture: ComponentFixture<SupportReferralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, BrowserAnimationsModule, SupportReferralComponent],
      providers: [UntypedFormBuilder, DatePipe, { provide: computeInterfaceToken, useValue: {} }, provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
