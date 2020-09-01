import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreRegistrationComponent } from './pre-registration.component';

describe('PreRegistrationComponent', () => {
  let component: PreRegistrationComponent;
  let fixture: ComponentFixture<PreRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
