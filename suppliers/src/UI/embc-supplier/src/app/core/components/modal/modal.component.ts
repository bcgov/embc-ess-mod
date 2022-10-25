import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal.component.html'
})
export class ModalComponent {
  @Output() clearIndicator = new EventEmitter<boolean>();
  @Input() messageBody: string;
  @Input() buttonText: string;

  constructor(public activeModal: NgbActiveModal) {}

  action(indicator: boolean) {
    this.clearIndicator.emit(indicator);
    this.activeModal.close('action');
  }
}
