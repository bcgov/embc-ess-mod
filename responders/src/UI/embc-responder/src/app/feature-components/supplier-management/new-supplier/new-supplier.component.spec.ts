import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSupplierComponent } from './new-supplier.component';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NewSupplierComponent', () => {
  let component: NewSupplierComponent;
  let fixture: ComponentFixture<NewSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewSupplierComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [UntypedFormBuilder]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
