import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import IdentifyNeedsComponent from './identify-needs.component';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('IdentifyNeedsComponent', () => {
  let component: IdentifyNeedsComponent;
  let fixture: ComponentFixture<IdentifyNeedsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IdentifyNeedsComponent],
      imports: [ReactiveFormsModule],
      providers: [UntypedFormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifyNeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
