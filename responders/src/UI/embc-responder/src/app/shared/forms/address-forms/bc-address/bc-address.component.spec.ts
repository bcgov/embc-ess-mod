import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BcAddressComponent } from './bc-address.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BcAddressComponent', () => {
  let component: BcAddressComponent;
  let fixture: ComponentFixture<BcAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BcAddressComponent]
    }).compileComponents();
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
