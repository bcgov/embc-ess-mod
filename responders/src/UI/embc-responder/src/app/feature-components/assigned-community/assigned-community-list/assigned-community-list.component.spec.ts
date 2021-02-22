import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedCommunityListComponent } from './assigned-community-list.component';

describe('AssignedCommunityListComponent', () => {
  let component: AssignedCommunityListComponent;
  let fixture: ComponentFixture<AssignedCommunityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedCommunityListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedCommunityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
