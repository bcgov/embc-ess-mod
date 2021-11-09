import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginService } from './core/services/login.service';
import { BootstrapService } from './core/services/bootstrap.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { APP_BASE_HREF } from '@angular/common';

describe('AppComponent', () => {
  let loginService: jasmine.SpyObj<LoginService>;
  let bootstrapService: jasmine.SpyObj<BootstrapService>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          RouterTestingModule,
          OAuthModule.forRoot()
        ],
        declarations: [AppComponent],
        providers: [
          { provides: LoginService, useValue: loginService },
          { provides: BootstrapService, useValue: bootstrapService },
          { provide: APP_BASE_HREF, useValue: '/' }
        ]
      }).compileComponents();
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
