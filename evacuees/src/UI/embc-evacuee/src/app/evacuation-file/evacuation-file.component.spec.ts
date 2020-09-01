import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvacuationFileComponent } from './evacuation-file.component';

describe('EvacuationFileComponent', () => {
  let component: EvacuationFileComponent;
  let fixture: ComponentFixture<EvacuationFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvacuationFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacuationFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
