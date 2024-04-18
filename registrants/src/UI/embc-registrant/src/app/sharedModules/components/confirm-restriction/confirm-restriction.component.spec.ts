import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmRestrictionComponent } from './confirm-restriction.component';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from '../../../core/services/formCreation.service';
import { provideRouter } from '@angular/router';

describe('ConfirmRestrictionComponent', () => {
  let component: ConfirmRestrictionComponent;
  let fixture: ComponentFixture<ConfirmRestrictionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ConfirmRestrictionComponent],
      providers: [UntypedFormBuilder, FormCreationService, provideRouter([])]
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
