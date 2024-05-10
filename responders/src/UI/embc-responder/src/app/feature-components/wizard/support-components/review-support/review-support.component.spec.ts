import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { DatePipe } from '@angular/common';
import { ReviewSupportComponent } from './review-support.component';
import { computeInterfaceToken } from 'src/app/app.module';

describe('ReviewSupportComponent', () => {
  let component: ReviewSupportComponent;
  let fixture: ComponentFixture<ReviewSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MatDialogModule],
      declarations: [ReviewSupportComponent],
      providers: [DatePipe, { provide: computeInterfaceToken, useValue: {} }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
