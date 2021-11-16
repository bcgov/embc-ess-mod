import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invite-error',
  templateUrl: './invite-error.component.html',
  styleUrls: ['./invite-error.component.scss']
})
export class InviteErrorComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: LocationStrategy
  ) {}

  ngOnInit(): void {
    // const replaceUrl = this.activatedRoute.snapshot.queryParams['url'];
    // if (replaceUrl) {
    //   this.location.replaceState(null, null, replaceUrl, null);
    // }
  }

  back(): void {
    this.router.navigate(['/registration-method']);
  }
}
