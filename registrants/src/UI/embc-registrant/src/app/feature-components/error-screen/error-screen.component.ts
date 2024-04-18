import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-screen',
  templateUrl: './error-screen.component.html',
  styleUrls: ['./error-screen.component.scss'],
  standalone: true
})
export class ErrorScreenComponent {
  constructor(private router: Router) {}

  nonVerifiedUser(): void {
    this.router.navigate(['/non-verified-registration/collection-notice']);
  }
}
