import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupplierComponent } from './add-supplier.component';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('AddSupplierComponent', () => {
  let component: AddSupplierComponent;
  let fixture: ComponentFixture<AddSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, AddSupplierComponent],
      providers: [UntypedFormBuilder, provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
