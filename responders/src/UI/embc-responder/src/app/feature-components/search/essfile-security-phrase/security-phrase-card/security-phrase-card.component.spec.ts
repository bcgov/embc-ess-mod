import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecurityPhraseCardComponent } from './security-phrase-card.component';

describe('SecurityPhraseCardComponent', () => {
  let component: SecurityPhraseCardComponent;
  let fixture: ComponentFixture<SecurityPhraseCardComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecurityPhraseCardComponent],
      imports: [ReactiveFormsModule, FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityPhraseCardComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.parentForm = formBuilder.group({
      phraseAnswer: ['']
    });
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
