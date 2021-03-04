import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvacuationFileListComponent } from './evacuation-file-list.component';

describe('EvacuationFileListComponent', () => {
  let component: EvacuationFileListComponent;
  let fixture: ComponentFixture<EvacuationFileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvacuationFileListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacuationFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
