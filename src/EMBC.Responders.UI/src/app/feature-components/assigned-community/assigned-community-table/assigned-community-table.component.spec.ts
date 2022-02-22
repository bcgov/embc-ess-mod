import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedCommunityTableComponent } from './assigned-community-table.component';

describe('DataTableComponent', () => {
  let component: AssignedCommunityTableComponent;
  let fixture: ComponentFixture<AssignedCommunityTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignedCommunityTableComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedCommunityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
