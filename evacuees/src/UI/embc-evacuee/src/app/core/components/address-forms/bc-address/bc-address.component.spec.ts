import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BcAddressComponent } from './bc-address.component';

describe('BcAddressComponent', () => {
  let component: BcAddressComponent;
  let fixture: ComponentFixture<BcAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BcAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BcAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
