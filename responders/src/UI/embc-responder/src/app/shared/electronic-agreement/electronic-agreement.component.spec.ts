import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronicAgreementComponent } from './electronic-agreement.component';

describe('ElectronicAgreementComponent', () => {
  let component: ElectronicAgreementComponent;
  let fixture: ComponentFixture<ElectronicAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectronicAgreementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectronicAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
