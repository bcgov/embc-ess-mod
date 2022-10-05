import { Component, TemplateRef } from '@angular/core';
import { ToastService } from '../../services/toast.service';
@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html'
})
export class ToastsComponent {
  constructor(public toastService: ToastService) {}
  isTemplate(toast) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
