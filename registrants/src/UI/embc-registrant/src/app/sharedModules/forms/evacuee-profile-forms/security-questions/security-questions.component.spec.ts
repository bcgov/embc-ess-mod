import { ComponentFixture, TestBed } from '@angular/core/testing';

import SecurityQuestionsComponent from './security-questions.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from 'src/app/core/services/formCreation.service';

describe('SecurityQuestionsComponent', () => {
  let component: SecurityQuestionsComponent;
  let fixture: ComponentFixture<SecurityQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule],
      declarations: [SecurityQuestionsComponent],
      providers: [UntypedFormBuilder, FormCreationService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
