import { Component, inject } from '@angular/core';

import { ToastService } from '../../services/toast.service';
import { NgTemplateOutlet } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [NgbToastModule, NgTemplateOutlet, FontAwesomeModule],
  templateUrl: './toasts-container.component.html',
  styleUrls: ['./toasts-container.component.scss']
})
export class ToastsContainerComponent {
  closeIcon = faXmark;
  toastService = inject(ToastService);
}
