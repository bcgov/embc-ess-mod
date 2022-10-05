import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  public async ngOnInit(): Promise<void> {
    try {
      const nextUrl = await this.authService.login();
    } catch (error) {
      console.error(error);
    } finally {
      this.router.navigate(['auth']);
    }
  }
}
