import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invite-error',
  templateUrl: './invite-error.component.html',
  styleUrls: ['./invite-error.component.scss']
})
export class InviteErrorComponent {
  constructor(private router: Router) {}

  back(): void {
    this.router.navigate(['/registration-method']);
  }
}
