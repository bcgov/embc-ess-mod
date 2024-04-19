import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EvacuationDetailsComponent } from './evacuation-details.component';

describe('EvacuationDetailsComponent', () => {
  let component: EvacuationDetailsComponent;
  let fixture: ComponentFixture<EvacuationDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EvacuationDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacuationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
