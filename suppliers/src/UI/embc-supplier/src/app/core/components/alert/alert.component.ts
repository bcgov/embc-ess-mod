import { Component, OnInit } from '@angular/core';
import { Alert } from 'src/app/model/alert';
import { AlertService } from 'src/app/service/alert.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit{

    type: string;
    alerts: Alert[] = [];

    constructor(private alertService: AlertService) {}

    ngOnInit() {
        this.alertService.getAlerts().subscribe((alert: Alert) => {
            if (!alert) {
                this.alerts = [];
                return;
            }
            this.alerts.push(alert);
        });
    }

    close(alert: Alert) {
        this.alerts.splice(this.alerts.indexOf(alert), 1);
      }

}
