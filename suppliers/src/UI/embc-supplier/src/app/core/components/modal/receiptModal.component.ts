import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'receipt-modal-content',
    template: `
      <div class="modal-header">
      <h4>Alert</h4>
        <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>You are about to clear all invoice information.</p>
        <p>Are you sure you want to do this?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="action(false)">No</button>
        <button type="button" class="btn btn-primary" (click)="action(true)">Yes, Clear invoice information</button>
      </div>
    `
  })
  export class ReceiptModalContent {
    @Output() clearIndicator = new EventEmitter<boolean>();
  
    constructor(public activeModal: NgbActiveModal) {}

    action(indicator: boolean) {
      this.clearIndicator.emit(indicator);
      this.activeModal.close();
    }
  }