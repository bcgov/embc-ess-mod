import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Alert } from '../core/model/alert';
import { AlertService } from '../core/services/alert.service';

@Injectable({ providedIn: 'root' })
export class MockAlertService extends AlertService {
  constructor(router: Router) {
    super(router);
  }
  getAlerts(): Observable<Alert> {
    return of({ type: 'error', message: 'error' });
  }
}
