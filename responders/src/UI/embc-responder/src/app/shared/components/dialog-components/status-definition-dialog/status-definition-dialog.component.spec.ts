import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusDefinitionDialogComponent } from './status-definition-dialog.component';

describe('StatusDefinitionDialogComponent', () => {
  let component: StatusDefinitionDialogComponent;
  let fixture: ComponentFixture<StatusDefinitionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusDefinitionDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusDefinitionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
