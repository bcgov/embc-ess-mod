import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssFileSupportsComponent } from './ess-file-supports.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('EssFileSupportsComponent', () => {
  let component: EssFileSupportsComponent;
  let fixture: ComponentFixture<EssFileSupportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, EssFileSupportsComponent],
      providers: [provideRouter([])]
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
