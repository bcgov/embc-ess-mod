import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import ContactInfoComponent from './contact-info.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ContactInfoComponent', () => {
  let component: ContactInfoComponent;
  let fixture: ComponentFixture<ContactInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactInfoComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
