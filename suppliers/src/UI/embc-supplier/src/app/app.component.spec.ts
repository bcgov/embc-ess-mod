import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SupplierHttpService } from './core/services/supplierHttp.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from './core/services/authentication.service';
import {
  OAuthLogger,
  OAuthService,
  UrlHelperService
} from 'angular-oauth2-oidc';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [AppComponent],
      providers: [
        SupplierHttpService,
        AuthenticationService,
        OAuthService,
        UrlHelperService,
        OAuthLogger
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should be created`, () => {
    const service: SupplierHttpService = TestBed.inject(SupplierHttpService);
    expect(service).toBeTruthy();
  });

  it('should have getListOfCities function', () => {
    const service: SupplierHttpService = TestBed.inject(SupplierHttpService);
    expect(service.getListOfCities).toBeTruthy();
  });

  it('should have getListOfProvinces function', () => {
    const service: SupplierHttpService = TestBed.inject(SupplierHttpService);
    expect(service.getListOfProvinces).toBeTruthy();
  });

  it('should have getListOfStates function', () => {
    const service: SupplierHttpService = TestBed.inject(SupplierHttpService);
    expect(service.getListOfStates).toBeTruthy();
  });

  it('should have getListOfCountries function', () => {
    const service: SupplierHttpService = TestBed.inject(SupplierHttpService);
    expect(service.getListOfCountries).toBeTruthy();
  });

  it('should have getListOfSupportItems function', () => {
    const service: SupplierHttpService = TestBed.inject(SupplierHttpService);
    expect(service.getListOfSupportItems).toBeTruthy();
  });
});
