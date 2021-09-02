import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodGroceriesComponent } from './food-groceries.component';

describe('FoodGroceriesComponent', () => {
  let component: FoodGroceriesComponent;
  let fixture: ComponentFixture<FoodGroceriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoodGroceriesComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodGroceriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
