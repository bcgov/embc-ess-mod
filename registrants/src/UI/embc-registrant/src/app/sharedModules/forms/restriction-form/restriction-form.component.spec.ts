import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RestrictionFormComponent } from './restriction-form.component';

describe('RestrictionFormComponent', () => {
  let component: RestrictionFormComponent;
  let fixture: ComponentFixture<RestrictionFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RestrictionFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestrictionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
