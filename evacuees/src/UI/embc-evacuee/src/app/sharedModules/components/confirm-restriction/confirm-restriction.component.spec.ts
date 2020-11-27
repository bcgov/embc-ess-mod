import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRestrictionComponent } from './confirm-restriction.component';

describe('ConfirmRestrictionComponent', () => {
  let component: ConfirmRestrictionComponent;
  let fixture: ComponentFixture<ConfirmRestrictionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmRestrictionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmRestrictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
