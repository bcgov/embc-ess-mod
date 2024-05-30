import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-step-notes',
  templateUrl: './step-notes.component.html',
  styleUrls: ['./step-notes.component.scss'],
  standalone: true,
  imports: [AlertComponent, RouterOutlet]
})
export class StepNotesComponent {
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
}
