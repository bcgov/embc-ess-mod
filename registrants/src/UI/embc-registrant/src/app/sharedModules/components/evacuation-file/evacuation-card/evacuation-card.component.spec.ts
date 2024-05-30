import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EvacuationCardComponent } from './evacuation-card.component';

describe('EvacuationCardComponent', () => {
  let component: EvacuationCardComponent;
  let fixture: ComponentFixture<EvacuationCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EvacuationCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacuationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
