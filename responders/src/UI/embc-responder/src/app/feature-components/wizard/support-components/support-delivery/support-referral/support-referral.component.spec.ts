import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportReferralComponent } from './support-referral.component';

describe('SupportReferralComponent', () => {
  let component: SupportReferralComponent;
  let fixture: ComponentFixture<SupportReferralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupportReferralComponent]
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
