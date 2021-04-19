import { Component, Input, OnInit } from '@angular/core';
import { ConfigGuard } from '../core/guards/config.guard';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {
  @Input() bannerMsg: string = "The ERA Supplier Portal is currently undergoing maintenance and will be back as soon as possible. We apologize for any inconvenience.";
  
  constructor(configGuard: ConfigGuard) {
    let configResult = configGuard.configResult;
    this.bannerMsg = configResult.maintMsg;
  }

  ngOnInit(): void {
  }
}
