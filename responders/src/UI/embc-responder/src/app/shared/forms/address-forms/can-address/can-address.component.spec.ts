import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CanAddressComponent } from './can-address.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';

describe('CanAddressComponent', () => {
  let component: CanAddressComponent;
  let fixture: ComponentFixture<CanAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatAutocompleteModule],
      declarations: [CanAddressComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
