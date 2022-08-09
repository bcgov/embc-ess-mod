import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponderAccessComponent } from './responder-access.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ResponderAccessComponent', () => {
  let component: ResponderAccessComponent;
  let fixture: ComponentFixture<ResponderAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ResponderAccessComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponderAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
