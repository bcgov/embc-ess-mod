import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssFileDetailsComponent } from './ess-file-details.component';

describe('EssFileDetailsComponent', () => {
  let component: EssFileDetailsComponent;
  let fixture: ComponentFixture<EssFileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssFileDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssFileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
