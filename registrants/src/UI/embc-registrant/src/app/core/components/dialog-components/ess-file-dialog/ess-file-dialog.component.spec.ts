import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssFileDialogComponent } from './ess-file-dialog.component';

describe('EssFileDialogComponent', () => {
  let component: EssFileDialogComponent;
  let fixture: ComponentFixture<EssFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EssFileDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
