import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import EvacAddressComponent from './evac-address.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from '../../../../core/services/formCreation.service';

describe('EvacAddressComponent', () => {
  let component: EvacAddressComponent;
  let fixture: ComponentFixture<EvacAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvacAddressComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [ FormCreationService, FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
