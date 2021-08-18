import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSupportsComponent } from './view-supports.component';

describe('ViewSupportsComponent', () => {
  let component: ViewSupportsComponent;
  let fixture: ComponentFixture<ViewSupportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewSupportsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSupportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
