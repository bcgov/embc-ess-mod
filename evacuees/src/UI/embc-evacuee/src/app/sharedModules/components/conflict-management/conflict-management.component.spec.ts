import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictManagementComponent } from './conflict-management.component';

describe('ConflictManagementComponent', () => {
  let component: ConflictManagementComponent;
  let fixture: ComponentFixture<ConflictManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConflictManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
