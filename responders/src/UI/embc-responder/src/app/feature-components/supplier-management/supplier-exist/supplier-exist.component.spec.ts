import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierExistComponent } from './supplier-exist.component';

describe('SupplierExistComponent', () => {
  let component: SupplierExistComponent;
  let fixture: ComponentFixture<SupplierExistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplierExistComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierExistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
