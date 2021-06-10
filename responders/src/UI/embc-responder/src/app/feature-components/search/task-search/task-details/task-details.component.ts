import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EssTask } from 'src/app/core/api/models';
import { EssTaskModel } from 'src/app/core/models/ess-task.model';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  essTask: EssTaskModel;
  taskNumber: string;
  taskStatus: string;

  constructor(private router: Router, private userService: UserService) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state
          .essTask as EssTask;
        this.essTask = state;
        this.taskNumber = state.id;
        this.taskStatus = state.status;
      }
    }
  }

  ngOnInit(): void {}

  searchTask(): void {
    this.router.navigate(['/responder-access/search/task']);
  }

  signInTask(): void {
    this.userService.updateTaskNumber(this.taskNumber);
    this.router.navigate(['/responder-access/search/evacuee']);
  }
}
