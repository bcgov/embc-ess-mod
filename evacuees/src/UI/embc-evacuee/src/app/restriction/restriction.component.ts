import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restriction',
  templateUrl: './restriction.component.html',
  styleUrls: ['./restriction.component.scss']
})
export class RestrictionComponent implements OnInit {

  constructor(private router: Router ) { }

  ngOnInit(): void {
  }

  submitRestriction(): void {
    this.router.navigate(['/loader/registration/first']);
  }

}
