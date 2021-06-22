import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { SecurityPhraseCardComponent } from './security-phrase-card.component';

describe('SecurityPhraseCardComponent', () => {
  let component: SecurityPhraseCardComponent;
  let fixture: ComponentFixture<SecurityPhraseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SecurityPhraseCardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityPhraseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
