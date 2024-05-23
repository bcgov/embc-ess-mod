import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportEtransferComponent } from './support-etransfer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { UntypedFormBuilder } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { computeInterfaceToken } from 'src/app/app.module';
import { provideRouter } from '@angular/router';

describe('SupportEtransferComponent', () => {
  let component: SupportEtransferComponent;
  let fixture: ComponentFixture<SupportEtransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, BrowserAnimationsModule, SupportEtransferComponent],
      providers: [UntypedFormBuilder, DatePipe, { provide: computeInterfaceToken, useValue: {} }, provideRouter([])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportEtransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
