import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityQuestionCardComponent } from './security-question-card.component';

describe('SecurityQuestionCardComponent', () => {
  let component: SecurityQuestionCardComponent;
  let fixture: ComponentFixture<SecurityQuestionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecurityQuestionCardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityQuestionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
