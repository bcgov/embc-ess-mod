import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutComponent {

  constructor(private authService: AuthService) {
    this.authService.logout('/');
  }

}
