import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  verifyUser(): void {
    this.router.navigate(['/verified-registration/collection-notice'])
  }

  nonVerifiedUser(): void {
    this.router.navigate(['/non-verified-registration/collection-notice']);
  }

}
