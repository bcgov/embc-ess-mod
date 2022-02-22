import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedCommunityListComponent } from './assigned-community-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AssignedCommunityListComponent', () => {
  let component: AssignedCommunityListComponent;
  let fixture: ComponentFixture<AssignedCommunityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [AssignedCommunityListComponent]
    }).compileComponents();
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
