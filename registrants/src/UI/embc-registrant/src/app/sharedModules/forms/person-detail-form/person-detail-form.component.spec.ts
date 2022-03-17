import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PersonDetailFormComponent } from './person-detail-form.component';

describe('PersonDetailFormComponent', () => {
  let component: PersonDetailFormComponent;
  let fixture: ComponentFixture<PersonDetailFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PersonDetailFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
