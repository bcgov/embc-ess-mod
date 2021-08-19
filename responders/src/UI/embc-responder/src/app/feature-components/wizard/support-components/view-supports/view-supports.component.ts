import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-supports',
  templateUrl: './view-supports.component.html',
  styleUrls: ['./view-supports.component.scss']
})
export class ViewSupportsComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  addSupports() {
    this.router.navigate(['/ess-wizard/add-supports/select-support']);
  }
}
