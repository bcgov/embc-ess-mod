import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsaAddressComponent } from './usa-address.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';

describe('UsaAddressComponent', () => {
  let component: UsaAddressComponent;
  let fixture: ComponentFixture<UsaAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatAutocompleteModule],
      declarations: [UsaAddressComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsaAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
