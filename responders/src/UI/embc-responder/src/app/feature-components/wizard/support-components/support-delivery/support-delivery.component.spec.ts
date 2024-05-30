import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportDeliveryComponent } from './support-delivery.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { computeInterfaceToken } from 'src/app/app.module';
import { provideRouter } from '@angular/router';

describe('SupportDeliveryComponent', () => {
  let component: SupportDeliveryComponent;
  let fixture: ComponentFixture<SupportDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatAutocompleteModule, MatDialogModule, SupportDeliveryComponent],
      providers: [UntypedFormBuilder, DatePipe, { provide: computeInterfaceToken, useValue: {} }, provideRouter([])]
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
