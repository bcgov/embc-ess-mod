import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsaAddressComponent } from './usa-address.component';

describe('UsaAddressComponent', () => {
  let component: UsaAddressComponent;
  let fixture: ComponentFixture<UsaAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsaAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsaAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
