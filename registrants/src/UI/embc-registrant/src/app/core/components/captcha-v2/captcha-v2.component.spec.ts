import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptchaV2Component } from './captcha-v2.component';

describe('CaptchaV2Component', () => {
  let component: CaptchaV2Component;
  let fixture: ComponentFixture<CaptchaV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaptchaV2Component]
    }).compileComponents();

    fixture = TestBed.createComponent(CaptchaV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
