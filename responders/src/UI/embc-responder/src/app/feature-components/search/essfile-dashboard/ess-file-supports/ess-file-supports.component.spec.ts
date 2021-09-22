import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssFileSupportsComponent } from './ess-file-supports.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('EssFileSupportsComponent', () => {
  let component: EssFileSupportsComponent;
  let fixture: ComponentFixture<EssFileSupportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [EssFileSupportsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssFileSupportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
