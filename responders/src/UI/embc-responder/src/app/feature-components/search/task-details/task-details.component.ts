import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {

  taskNumber: string;
  isActive = true;
  isExpired = false;
  isInvalid = false;

  constructor(private router: Router, private userService: UserService) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state.taskNumber as string;
        this.taskNumber = state;
      }
    }
  }

  ngOnInit(): void {
  }

  searchTask(): void {
    this.router.navigate(['/responder-access/search/task']);
  }

  signInTask(): void {
    this.userService.updateTaskNumber(this.taskNumber);
    this.router.navigate(['/responder-access/search/evacuee']);
  }

}
