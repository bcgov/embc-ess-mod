import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
  MatLegacyDialogModule as MatDialogModule
} from '@angular/material/legacy-dialog';
import { OutageDialogComponent } from './outage-dialog.component';

describe('OutageDialogComponent', () => {
  let component: OutageDialogComponent;
  let fixture: ComponentFixture<OutageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [OutageDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
