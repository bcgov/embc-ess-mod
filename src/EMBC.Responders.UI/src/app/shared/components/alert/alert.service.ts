import { Injectable } from '@angular/core';
import { Alert } from '../../../core/models/alert';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new Subject<Alert>();
  private keepAfterRouteChange = false;

  /**
   * Clear alert messages on route change unless 'keepAfterRouteChange' flag is true
   *
   * @param router : navigation api
   */
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          this.keepAfterRouteChange = false;
        } else {
          this.clearAlert();
        }
      }
    });
  }

  /**
   * Create's alert object and pushes to alert's array
   *
   * @param message : Alert message to be displayed
   * @param type : valid values => 'success', 'info', 'warning', 'danger'
   */
  setAlert(message: string, type: string): void {
    this.alertSubject.next(new Alert(message, type));
  }

  getAlerts(): Observable<Alert> {
    return this.alertSubject.asObservable();
  }

  clearAlert(): void {
    this.alertSubject.next(null);
  }
}
