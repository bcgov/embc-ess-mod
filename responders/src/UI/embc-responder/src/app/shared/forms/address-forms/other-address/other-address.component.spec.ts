import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OtherAddressComponent } from './other-address.component';

describe('OtherAddressComponent', () => {
  let component: OtherAddressComponent;
  let fixture: ComponentFixture<OtherAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OtherAddressComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
