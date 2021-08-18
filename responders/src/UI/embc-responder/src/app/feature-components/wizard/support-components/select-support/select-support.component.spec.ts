import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSupportComponent } from './select-support.component';

describe('SelectSupportComponent', () => {
  let component: SelectSupportComponent;
  let fixture: ComponentFixture<SelectSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectSupportComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
