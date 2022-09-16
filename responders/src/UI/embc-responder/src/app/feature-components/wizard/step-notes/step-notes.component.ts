import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step-notes',
  templateUrl: './step-notes.component.html',
  styleUrls: ['./step-notes.component.scss']
})
export class StepNotesComponent implements OnInit {
  stepName: string;

  constructor(private router: Router) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state as {
          step: string;
          title: string;
        };
        this.stepName = state.title;
      }
    }
  }

  ngOnInit(): void {}
}
