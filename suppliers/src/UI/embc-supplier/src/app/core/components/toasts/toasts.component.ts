import { Component, TemplateRef } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { NgTemplateOutlet } from '@angular/common';
@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  standalone: true,
  imports: [NgbToast, NgTemplateOutlet]
})
export class ToastsComponent {
  constructor(public toastService: ToastService) {}
  isTemplate(toast) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
