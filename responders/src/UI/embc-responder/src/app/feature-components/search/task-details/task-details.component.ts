import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {

  isActive = true;
  isExpired = false;
  isInvalid = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  searchTask(): void {
    //this.showSearch = !this.showSearch;
    //this.isActive = !this.isActive;
    // this.isExpired = !this.isExpired;
    this.router.navigate(['/responder-access/search/task']);
  }

  signInTask(): void {
    this.router.navigate(['/responder-access/search/evacuee'])
  }

}
