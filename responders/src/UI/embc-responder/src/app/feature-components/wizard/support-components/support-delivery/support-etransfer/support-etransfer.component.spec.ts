import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportEtransferComponent } from './support-etransfer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { UntypedFormBuilder } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { computeInterfaceToken } from 'src/app/app.module';

describe('SupportEtransferComponent', () => {
  let component: SupportEtransferComponent;
  let fixture: ComponentFixture<SupportEtransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      declarations: [SupportEtransferComponent],
      providers: [
        UntypedFormBuilder,
        DatePipe,
        { provide: computeInterfaceToken, useValue: {} }
      ],
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
