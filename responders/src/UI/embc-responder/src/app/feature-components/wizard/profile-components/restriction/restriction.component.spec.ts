import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictionComponent } from './restriction.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('RestrictionComponent', () => {
  let component: RestrictionComponent;
  let fixture: ComponentFixture<RestrictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [RestrictionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestrictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
