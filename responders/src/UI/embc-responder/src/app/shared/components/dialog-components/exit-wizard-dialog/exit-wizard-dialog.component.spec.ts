import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitWizardDialogComponent } from './exit-wizard-dialog.component';

describe('ExitWizardDialogComponent', () => {
  let component: ExitWizardDialogComponent;
  let fixture: ComponentFixture<ExitWizardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExitWizardDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitWizardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
