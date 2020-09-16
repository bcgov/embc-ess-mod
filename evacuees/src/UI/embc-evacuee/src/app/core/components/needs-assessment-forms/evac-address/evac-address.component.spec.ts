import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvacAddressComponent } from './evac-address.component';

describe('EvacAddressComponent', () => {
  let component: EvacAddressComponent;
  let fixture: ComponentFixture<EvacAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvacAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
