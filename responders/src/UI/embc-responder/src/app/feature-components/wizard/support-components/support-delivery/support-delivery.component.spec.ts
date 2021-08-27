import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportDeliveryComponent } from './support-delivery.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

describe('SupportDeliveryComponent', () => {
  let component: SupportDeliveryComponent;
  let fixture: ComponentFixture<SupportDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatAutocompleteModule
      ],
      declarations: [SupportDeliveryComponent],
      providers: [FormBuilder]
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
