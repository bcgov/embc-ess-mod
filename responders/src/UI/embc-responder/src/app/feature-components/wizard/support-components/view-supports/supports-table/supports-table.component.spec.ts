import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportsTableComponent } from './supports-table.component';

describe('SupportsTableComponent', () => {
  let component: SupportsTableComponent;
  let fixture: ComponentFixture<SupportsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupportsTableComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
