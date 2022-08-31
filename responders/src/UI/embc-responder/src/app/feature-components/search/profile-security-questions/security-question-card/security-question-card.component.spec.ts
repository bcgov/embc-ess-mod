import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { SecurityQuestionCardComponent } from './security-question-card.component';

describe('SecurityQuestionCardComponent', () => {
  let component: SecurityQuestionCardComponent;
  let fixture: ComponentFixture<SecurityQuestionCardComponent>;
  let formBuilder: UntypedFormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecurityQuestionCardComponent],
      imports: [ReactiveFormsModule, FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityQuestionCardComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(UntypedFormBuilder);

    component.parentForm = formBuilder.group({
      answer1: [''],
      answer2: [''],
      answer3: ['']
    });
    component.index = 1;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
