import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAuthProfileComponent } from './view-auth-profile.component';

describe('ViewAuthProfileComponent', () => {
  let component: ViewAuthProfileComponent;
  let fixture: ComponentFixture<ViewAuthProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAuthProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAuthProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
