import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteHouseholdDialogComponent } from './delete-household-dialog.component';

describe('DeleteHouseholdDialogComponent', () => {
  let component: DeleteHouseholdDialogComponent;
  let fixture: ComponentFixture<DeleteHouseholdDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteHouseholdDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteHouseholdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
