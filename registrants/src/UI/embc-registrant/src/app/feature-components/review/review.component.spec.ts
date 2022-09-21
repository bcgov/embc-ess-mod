import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReviewComponent } from './review.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from '../../core/services/formCreation.service';

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewComponent],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [UntypedFormBuilder, FormCreationService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
