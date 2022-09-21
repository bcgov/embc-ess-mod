import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmRestrictionComponent } from './confirm-restriction.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from '../../../core/services/formCreation.service';

describe('ConfirmRestrictionComponent', () => {
  let component: ConfirmRestrictionComponent;
  let fixture: ComponentFixture<ConfirmRestrictionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmRestrictionComponent],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [UntypedFormBuilder, FormCreationService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmRestrictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
