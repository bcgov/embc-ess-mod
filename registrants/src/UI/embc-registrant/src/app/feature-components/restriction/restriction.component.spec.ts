import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RestrictionComponent } from './restriction.component';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';

describe('RestrictionComponent', () => {
  let component: RestrictionComponent;
  let fixture: ComponentFixture<RestrictionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RestrictionComponent, provideRouter([])],
      providers: [UntypedFormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestrictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
