import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportDeliveryComponent } from './support-delivery.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { computeInterfaceToken } from 'src/app/app.module';

describe('SupportDeliveryComponent', () => {
  let component: SupportDeliveryComponent;
  let fixture: ComponentFixture<SupportDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatAutocompleteModule,
        MatDialogModule
      ],
      declarations: [SupportDeliveryComponent],
      providers: [
        UntypedFormBuilder,
        DatePipe,
        { provide: computeInterfaceToken, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
