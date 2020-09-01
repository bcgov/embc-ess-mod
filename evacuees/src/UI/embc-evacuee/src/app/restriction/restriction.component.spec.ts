import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictionComponent } from './restriction.component';

describe('RestrictionComponent', () => {
  let component: RestrictionComponent;
  let fixture: ComponentFixture<RestrictionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestrictionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestrictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
