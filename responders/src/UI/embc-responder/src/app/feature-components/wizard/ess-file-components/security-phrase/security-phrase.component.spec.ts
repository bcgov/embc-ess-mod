import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityPhraseComponent } from './security-phrase.component';

describe('SecurityPhraseComponent', () => {
  let component: SecurityPhraseComponent;
  let fixture: ComponentFixture<SecurityPhraseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecurityPhraseComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityPhraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
