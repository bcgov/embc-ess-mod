import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedEssfileComponent } from './selected-essfile.component';

describe('SelectedEssfileComponent', () => {
  let component: SelectedEssfileComponent;
  let fixture: ComponentFixture<SelectedEssfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectedEssfileComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedEssfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
