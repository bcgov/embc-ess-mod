import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import PersonalDetailsComponent from './personal-details.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { FormCreationService } from 'src/app/core/services/formCreation.service';

describe('PersonalDetailsComponent', () => {
  let component: PersonalDetailsComponent;
  let fixture: ComponentFixture<PersonalDetailsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PersonalDetailsComponent],
        imports: [ReactiveFormsModule],
        providers: [FormCreationService, FormBuilder]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
