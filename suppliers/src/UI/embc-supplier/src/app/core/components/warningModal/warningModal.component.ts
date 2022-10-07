import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-warning-modal',
  templateUrl: './warningModal.component.html'
})
export class WarningModalComponent {
  @Input() messageBody: string;

  constructor(public activeModal: NgbActiveModal) {}

  action() {
    this.activeModal.close();
  }
}
