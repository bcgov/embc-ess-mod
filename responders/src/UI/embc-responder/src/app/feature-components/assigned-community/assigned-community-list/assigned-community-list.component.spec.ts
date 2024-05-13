import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedCommunityListComponent } from './assigned-community-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('AssignedCommunityListComponent', () => {
  let component: AssignedCommunityListComponent;
  let fixture: ComponentFixture<AssignedCommunityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AssignedCommunityListComponent],
      providers: [provideRouter([])]
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
