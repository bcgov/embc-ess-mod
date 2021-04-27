import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService } from 'src/app/core/services/user.service';

import { TopNavMenuComponent } from './top-nav-menu.component';

describe('TopNavMenuComponent', () => {
  let component: TopNavMenuComponent;
  let fixture: ComponentFixture<TopNavMenuComponent>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['hasClaim']);

    await TestBed.configureTestingModule({
      declarations: [TopNavMenuComponent],
      providers: [{ provide: UserService, useValue: userServiceSpy }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
