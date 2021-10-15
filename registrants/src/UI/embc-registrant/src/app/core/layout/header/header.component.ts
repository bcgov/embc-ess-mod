import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormCreationService } from '../../services/formCreation.service';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs/operators';
import { CacheService } from '../../services/cache.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showLoginMatMenu: boolean;

  constructor(
    public formCreationService: FormCreationService,
    public authService: AuthService,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    this.authService.loggedInStatus$.subscribe((val) => {
      this.showLoginMatMenu = val;
    });
  }

  homeButton(): void {}

  signOut(): void {
    this.cacheService.clear();
    this.authService.logout('/registration-method');
  }
}
