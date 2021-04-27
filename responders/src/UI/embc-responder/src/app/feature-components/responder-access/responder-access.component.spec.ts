import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponderAccessComponent } from './responder-access.component';

describe('ResponderAccessComponent', () => {
  let component: ResponderAccessComponent;
  let fixture: ComponentFixture<ResponderAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponderAccessComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponderAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
