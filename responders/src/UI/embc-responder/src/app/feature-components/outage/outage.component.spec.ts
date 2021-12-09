import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutageComponent } from './outage.component';

describe('OutageComponent', () => {
  let component: OutageComponent;
  let fixture: ComponentFixture<OutageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutageComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
