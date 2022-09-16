import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportDetailsComponent } from './support-details.component';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { computeInterfaceToken } from 'src/app/app.module';

describe('SupportDetailsComponent', () => {
  let component: SupportDetailsComponent;
  let fixture: ComponentFixture<SupportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MatDialogModule],
      declarations: [SupportDetailsComponent],
      providers: [
        DatePipe,
        UntypedFormBuilder,
        { provide: computeInterfaceToken, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
