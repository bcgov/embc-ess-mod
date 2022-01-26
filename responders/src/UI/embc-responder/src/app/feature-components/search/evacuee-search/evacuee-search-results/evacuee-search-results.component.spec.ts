import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvacueeSearchResultsComponent } from './evacuee-search-results.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';

describe('EvacueeSearchResultsComponent', () => {
  let component: EvacueeSearchResultsComponent;
  let fixture: ComponentFixture<EvacueeSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvacueeSearchResultsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacueeSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
