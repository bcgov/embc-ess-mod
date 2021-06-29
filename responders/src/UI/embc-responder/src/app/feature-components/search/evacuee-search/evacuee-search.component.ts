import { Component, OnInit } from '@angular/core';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';

@Component({
  selector: 'app-evacuee-search',
  templateUrl: './evacuee-search.component.html',
  styleUrls: ['./evacuee-search.component.scss']
})
export class EvacueeSearchComponent implements OnInit {
  showPhotoIDComponent = true;
  showResultsComponent = false;

  constructor(private evacueeSessionService: EvacueeSessionService) {}

  ngOnInit(): void {
    this.evacueeSessionService.clearEvacueeSession();
  }

  /**
   * Receives the emitted event from evacuee-id-verify child and changes the component to show
   */
  changeVerifyIdComponent(value: boolean): void {
    this.showPhotoIDComponent = value;
  }

  /**
   * Receives the emitted event from evacuee-name-search child and changes the component to show
   */
  changeResultsComponent(value: boolean): void {
    this.showResultsComponent = value;
  }

  allowNewSearch($event: boolean): void {
    this.showPhotoIDComponent = $event;
    this.showResultsComponent = !$event;
  }
}
