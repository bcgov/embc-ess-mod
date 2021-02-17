import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponderManagementComponent } from './responder-management.component';

describe('ResponderManagementComponent', () => {
  let component: ResponderManagementComponent;
  let fixture: ComponentFixture<ResponderManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponderManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
