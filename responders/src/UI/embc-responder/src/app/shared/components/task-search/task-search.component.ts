import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.scss']
})
export class TaskSearchComponent implements OnInit {

  showSearch = true;
  isActive = false;
  isExpired = false;
  isIncorrect = false;

  constructor() { }

  ngOnInit(): void {
  }


  submitTask(): void {
    this.showSearch = !this.showSearch;
    this.isActive = !this.isActive;
    // this.isExpired = !this.isExpired;
  }

  searchTask(): void {
    this.showSearch = !this.showSearch;
    this.isActive = !this.isActive;
    // this.isExpired = !this.isExpired;
  }

  signInTask(): void {

  }

}
