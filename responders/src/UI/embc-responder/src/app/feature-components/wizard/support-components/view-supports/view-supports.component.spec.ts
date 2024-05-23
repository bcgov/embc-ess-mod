import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSupportsComponent } from './view-supports.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { computeInterfaceToken } from 'src/app/app.module';
import { provideRouter } from '@angular/router';

describe('ViewSupportsComponent', () => {
  let component: ViewSupportsComponent;
  let fixture: ComponentFixture<ViewSupportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, ViewSupportsComponent],
      providers: [DatePipe, { provide: computeInterfaceToken, useValue: {} }, provideRouter([])]
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
