import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRestrictionComponent } from './confirm-restriction.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from '../../../core/services/formCreation.service';

describe('ConfirmRestrictionComponent', () => {
  let component: ConfirmRestrictionComponent;
  let fixture: ComponentFixture<ConfirmRestrictionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmRestrictionComponent ],
      imports: [ RouterTestingModule, ReactiveFormsModule ],
      providers: [ FormBuilder, FormCreationService]
    })
    .compileComponents();
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
