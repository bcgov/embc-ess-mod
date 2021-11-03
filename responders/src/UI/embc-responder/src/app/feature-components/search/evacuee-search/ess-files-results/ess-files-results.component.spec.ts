import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { EssFilesResultsComponent } from './ess-files-results.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EssFilesResultsComponent', () => {
  let component: EssFilesResultsComponent;
  let fixture: ComponentFixture<EssFilesResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EssFilesResultsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssFilesResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
