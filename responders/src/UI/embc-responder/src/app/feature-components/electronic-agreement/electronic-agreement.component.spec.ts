import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronicAgreementComponent } from './electronic-agreement.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ElectronicAgreementComponent', () => {
  let component: ElectronicAgreementComponent;
  let fixture: ComponentFixture<ElectronicAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElectronicAgreementComponent],
      imports: [RouterTestingModule]
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
