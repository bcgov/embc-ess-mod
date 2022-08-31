import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverrideDatetimeComponent } from './override-datetime.component';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';

describe('OverrideDatetimeComponent', () => {
  let component: OverrideDatetimeComponent;
  let fixture: ComponentFixture<OverrideDatetimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [UntypedFormBuilder],
      declarations: [OverrideDatetimeComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverrideDatetimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
