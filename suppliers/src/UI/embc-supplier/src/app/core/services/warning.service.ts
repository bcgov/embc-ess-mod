import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WarningModalComponent } from '../components/warningModal/warningModal.component';

@Injectable({
  providedIn: 'root'
})
export class WarningService {
  constructor(private warningService: NgbModal) {}

  warningModal(message: string) {
    const modalRef = this.warningService.open(WarningModalComponent);
    modalRef.componentInstance.messageBody = message;
    const modalButtonClick = modalRef.componentInstance.clearIndicator;
  }
}
