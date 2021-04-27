import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleSideNavComponent } from './toggle-side-nav.component';

describe('ToggleSideNavComponent', () => {
  let component: ToggleSideNavComponent;
  let fixture: ComponentFixture<ToggleSideNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToggleSideNavComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
