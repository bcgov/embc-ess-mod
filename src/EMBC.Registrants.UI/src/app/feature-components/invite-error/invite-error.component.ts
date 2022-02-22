import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invite-error',
  templateUrl: './invite-error.component.html',
  styleUrls: ['./invite-error.component.scss']
})
export class InviteErrorComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  back(): void {
    this.router.navigate(['/registration-method']);
  }
}
