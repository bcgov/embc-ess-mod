import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedCommunityTableComponent } from './assigned-community-table.component';
import { provideRouter } from '@angular/router';

describe('DataTableComponent', () => {
  let component: AssignedCommunityTableComponent;
  let fixture: ComponentFixture<AssignedCommunityTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AssignedCommunityTableComponent],
      providers: [provideRouter([])]
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
