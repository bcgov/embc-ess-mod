import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'invoice-modal-content',
    template: `
      <div class="modal-header">
      <h4>Alert</h4>
        <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>You are about to <b>clear all receipt information</b>.</p>
        <p>Are you sure you want to do this?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="action(false)">No</button>
        <button type="button" class="btn btn-primary" (click)="action(true)">Yes, Clear receipt information</button>
      </div>
    `
  })
  export class InvoiceModalContent {
    @Output() clearIndicator = new EventEmitter<boolean>();

    constructor(public activeModal: NgbActiveModal) {}

    action(indicator: boolean) {
      this.clearIndicator.emit(indicator);
      this.activeModal.close();
    }
  }
