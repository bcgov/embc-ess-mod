import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityQuestionsComponent } from './security-questions.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('SecurityQuestionsComponent', () => {
  let component: SecurityQuestionsComponent;
  let fixture: ComponentFixture<SecurityQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule, ReactiveFormsModule],
      declarations: [SecurityQuestionsComponent],
      providers: [FormBuilder]
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
