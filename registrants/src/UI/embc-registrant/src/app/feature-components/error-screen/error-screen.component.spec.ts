import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorScreenComponent } from './error-screen.component';
import { provideRouter } from '@angular/router';

describe('ErrorScreenComponent', () => {
  let component: ErrorScreenComponent;
  let fixture: ComponentFixture<ErrorScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorScreenComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
