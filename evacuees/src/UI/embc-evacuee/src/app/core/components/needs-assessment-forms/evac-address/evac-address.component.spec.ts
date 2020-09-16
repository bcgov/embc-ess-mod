import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import EvacAddressComponent from './evac-address.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('EvacAddressComponent', () => {
  let component: EvacAddressComponent;
  let fixture: ComponentFixture<EvacAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvacAddressComponent ],
      imports: [ ReactiveFormsModule ]
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
