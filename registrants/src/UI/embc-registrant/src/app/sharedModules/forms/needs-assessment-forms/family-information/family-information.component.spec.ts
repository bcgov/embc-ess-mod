import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import FamilyInformationComponent from './family-information.component';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('FamilyInformationComponent', () => {
  let component: FamilyInformationComponent;
  let fixture: ComponentFixture<FamilyInformationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FamilyInformationComponent],
      imports: [ReactiveFormsModule],
      providers: [UntypedFormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
