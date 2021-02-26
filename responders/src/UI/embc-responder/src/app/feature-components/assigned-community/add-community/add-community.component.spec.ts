import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommunityComponent } from './add-community.component';

describe('AddCommunityComponent', () => {
  let component: AddCommunityComponent;
  let fixture: ComponentFixture<AddCommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCommunityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
