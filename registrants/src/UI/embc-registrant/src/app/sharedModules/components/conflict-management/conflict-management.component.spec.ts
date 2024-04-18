import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictManagementComponent } from './conflict-management.component';
import { provideRouter } from '@angular/router';

describe('ConflictManagementComponent', () => {
  let component: ConflictManagementComponent;
  let fixture: ComponentFixture<ConflictManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConflictManagementComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
