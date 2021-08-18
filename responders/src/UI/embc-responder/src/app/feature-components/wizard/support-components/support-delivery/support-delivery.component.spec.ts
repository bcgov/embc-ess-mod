import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportDeliveryComponent } from './support-delivery.component';

describe('SupportDeliveryComponent', () => {
  let component: SupportDeliveryComponent;
  let fixture: ComponentFixture<SupportDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupportDeliveryComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
