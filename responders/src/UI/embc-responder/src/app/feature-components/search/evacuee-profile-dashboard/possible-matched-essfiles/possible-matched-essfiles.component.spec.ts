import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PossibleMatchedEssfilesComponent } from './possible-matched-essfiles.component';

describe('PossibleMatchedEssfilesComponent', () => {
  let component: PossibleMatchedEssfilesComponent;
  let fixture: ComponentFixture<PossibleMatchedEssfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PossibleMatchedEssfilesComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PossibleMatchedEssfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
