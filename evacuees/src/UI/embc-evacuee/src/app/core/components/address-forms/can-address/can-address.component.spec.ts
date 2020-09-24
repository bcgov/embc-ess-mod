import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanAddressComponent } from './can-address.component';

describe('CanAddressComponent', () => {
  let component: CanAddressComponent;
  let fixture: ComponentFixture<CanAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
