import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSupportsComponent } from './view-supports.component';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { computeInterfaceToken } from 'src/app/app.module';

describe('ViewSupportsComponent', () => {
  let component: ViewSupportsComponent;
  let fixture: ComponentFixture<ViewSupportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MatDialogModule],
      declarations: [ViewSupportsComponent],
      providers: [DatePipe, { provide: computeInterfaceToken, useValue: {} }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSupportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
