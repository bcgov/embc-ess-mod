import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';

import { SecurityPhraseCardComponent } from './security-phrase-card.component';

describe('SecurityPhraseCardComponent', () => {
  let component: SecurityPhraseCardComponent;
  let fixture: ComponentFixture<SecurityPhraseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecurityPhraseCardComponent],
      imports: [ReactiveFormsModule, FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityPhraseCardComponent);
    component = fixture.componentInstance;
  });

  // it('should create', () => {
  //   fixture.detectChanges();
  //   expect(component).toBeTruthy();
  // });
});
