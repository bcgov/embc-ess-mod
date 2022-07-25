import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteSearchComponent } from './remote-search.component';

describe('RemoteSearchComponent', () => {
  let component: RemoteSearchComponent;
  let fixture: ComponentFixture<RemoteSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemoteSearchComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
