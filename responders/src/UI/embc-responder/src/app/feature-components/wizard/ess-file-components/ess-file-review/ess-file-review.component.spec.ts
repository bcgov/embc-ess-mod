import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssFileReviewComponent } from './ess-file-review.component';

describe('EssFileReviewComponent', () => {
  let component: EssFileReviewComponent;
  let fixture: ComponentFixture<EssFileReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EssFileReviewComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssFileReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
