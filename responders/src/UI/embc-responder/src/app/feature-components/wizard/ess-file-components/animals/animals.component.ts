import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StepCreateEssFileService } from '../../step-create-ess-file/step-create-ess-file.service';

@Component({
  selector: 'app-animals',
  templateUrl: './animals.component.html',
  styleUrls: ['./animals.component.scss']
})
export class AnimalsComponent implements OnInit {
  constructor(
    private router: Router,
    private stepCreateEssFileService: StepCreateEssFileService
  ) {}

  ngOnInit(): void {}

  /**
   * Updates the tab status and navigate to next tab
   */
  next(): void {
    this.stepCreateEssFileService.setTabStatus('animals', 'complete');
    this.router.navigate(['/ess-wizard/create-ess-file/review']);
  }
}
