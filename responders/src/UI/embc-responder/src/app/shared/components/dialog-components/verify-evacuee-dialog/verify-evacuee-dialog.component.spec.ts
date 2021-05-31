import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEvacueeDialogComponent } from './verify-evacuee-dialog.component';

describe('VerifyEvacueeDialogComponent', () => {
  let component: VerifyEvacueeDialogComponent;
  let fixture: ComponentFixture<VerifyEvacueeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyEvacueeDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyEvacueeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
