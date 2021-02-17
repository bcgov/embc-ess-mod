import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCommunityComponent } from './add-edit-community.component';

describe('AddEditCommunityComponent', () => {
  let component: AddEditCommunityComponent;
  let fixture: ComponentFixture<AddEditCommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCommunityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
