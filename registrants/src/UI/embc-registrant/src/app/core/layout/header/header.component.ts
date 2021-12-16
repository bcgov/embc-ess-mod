import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormCreationService } from '../../services/formCreation.service';
import { LoginService } from '../../services/login.service';
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
    public loginService: LoginService,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    this.loginService.isLoggedIn$.subscribe((val) => {
      this.showLoginMatMenu = val;
    });
  }

  homeButton(): void {}

  public async signOut(): Promise<void> {
    await this.loginService.logout();
    this.cacheService.clear();
    localStorage.clear();
  }
}
