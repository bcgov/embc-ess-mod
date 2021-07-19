import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { MatchedEssfilesComponent } from './matched-essfiles.component';

describe('MatchedEssfilesComponent', () => {
  let component: MatchedEssfilesComponent;
  let fixture: ComponentFixture<MatchedEssfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatchedEssfilesComponent],
      imports: [MatDialogModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchedEssfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
