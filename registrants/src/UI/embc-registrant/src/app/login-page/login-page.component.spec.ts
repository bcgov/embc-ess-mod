import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginService } from '../core/services/login.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { provideRouter } from '@angular/router';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(waitForAsync(() => {
    let loginService: jasmine.SpyObj<LoginService>;
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, OAuthModule.forRoot(), LoginPageComponent],
      providers: [UntypedFormBuilder, { provides: LoginService, useValue: loginService }, provideRouter([])]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
