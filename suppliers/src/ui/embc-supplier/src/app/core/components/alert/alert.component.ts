import { Component, OnInit } from '@angular/core';
import { Alert } from 'src/app/model/alert';
import { AlertService } from 'src/app/service/alert.service';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit{

    type: string;
    alerts: Alert[] = [];

    constructor(private alertService: AlertService) {}

    /**
     * Subscribes to the alert subject and set them in the array
     * if not empty
     */
    ngOnInit() {
        this.alertService.getAlerts().subscribe((alert: Alert) => {
            if (!alert) {
                this.alerts = [];
                return;
            }
            this.alerts.push(alert);
        });
    }

    /**
     * Removes the alert from the array
     * @param alert Alert to be deleted
     */
    close(alert: Alert) {
        this.alerts.splice(this.alerts.indexOf(alert), 1);
      }

}
