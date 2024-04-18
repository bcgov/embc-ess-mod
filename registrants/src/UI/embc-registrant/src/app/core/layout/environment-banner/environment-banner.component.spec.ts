import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentBannerComponent } from './environment-banner.component';
import { provideMarkdown } from 'ngx-markdown';

describe('EnvironmentBannerComponent', () => {
  let component: EnvironmentBannerComponent;
  let fixture: ComponentFixture<EnvironmentBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideMarkdown()],
      imports: [EnvironmentBannerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
