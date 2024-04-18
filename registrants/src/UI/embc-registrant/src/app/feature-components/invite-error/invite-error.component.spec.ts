import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteErrorComponent } from './invite-error.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('InviteErrorComponent', () => {
  let component: InviteErrorComponent;
  let fixture: ComponentFixture<InviteErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, InviteErrorComponent]
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
