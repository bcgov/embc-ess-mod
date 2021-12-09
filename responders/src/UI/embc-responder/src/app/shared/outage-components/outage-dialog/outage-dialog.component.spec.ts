import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutageDialogComponent } from './outage-dialog.component';

describe('OutageDialogComponent', () => {
  let component: OutageDialogComponent;
  let fixture: ComponentFixture<OutageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutageDialogComponent]
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
