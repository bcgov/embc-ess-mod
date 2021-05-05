import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedProfileComponent } from './selected-profile.component';

describe('SelectedProfileComponent', () => {
  let component: SelectedProfileComponent;
  let fixture: ComponentFixture<SelectedProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectedProfileComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
