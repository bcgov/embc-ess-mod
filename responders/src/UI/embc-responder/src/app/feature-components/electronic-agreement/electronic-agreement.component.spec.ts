import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronicAgreementComponent } from './electronic-agreement.component';
import { provideRouter } from '@angular/router';

describe('ElectronicAgreementComponent', () => {
  let component: ElectronicAgreementComponent;
  let fixture: ComponentFixture<ElectronicAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectronicAgreementComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectronicAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
