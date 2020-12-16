import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-responder-dashboard',
  templateUrl: './responder-dashboard.component.html',
  styleUrls: ['./responder-dashboard.component.scss']
})
export class ResponderDashboardComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  signinTask(): void {
    this.router.navigate(['/responder-access/search']);
  }

}
