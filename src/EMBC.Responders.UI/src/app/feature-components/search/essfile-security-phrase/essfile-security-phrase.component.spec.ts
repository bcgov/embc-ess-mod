import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { EssfileSecurityPhraseComponent } from './essfile-security-phrase.component';

describe('EssfileSecurityPhraseComponent', () => {
  let component: EssfileSecurityPhraseComponent;
  let fixture: ComponentFixture<EssfileSecurityPhraseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EssfileSecurityPhraseComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssfileSecurityPhraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
