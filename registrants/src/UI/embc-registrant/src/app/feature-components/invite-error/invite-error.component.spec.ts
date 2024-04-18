import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteErrorComponent } from './invite-error.component';
import { provideRouter } from '@angular/router';

describe('InviteErrorComponent', () => {
  let component: InviteErrorComponent;
  let fixture: ComponentFixture<InviteErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteErrorComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
