import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-screen',
  templateUrl: './error-screen.component.html',
  styleUrls: ['./error-screen.component.scss']
})
export class ErrorScreenComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  nonVerifiedUser(): void {
    this.router.navigate(['/non-verified-registration/collection-notice']);
  }
}
