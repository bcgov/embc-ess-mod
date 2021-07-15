import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssFileOverviewComponent } from './ess-file-overview.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('EssFileOverviewComponent', () => {
  let component: EssFileOverviewComponent;
  let fixture: ComponentFixture<EssFileOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [EssFileOverviewComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssFileOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
