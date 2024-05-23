import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OutageInformation } from 'src/app/core/api/models';
import { OutageService } from '../../../feature-components/outage/outage.service';
import { DatePipe } from '@angular/common';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-outage-banner',
  templateUrl: './outage-banner.component.html',
  styleUrls: ['./outage-banner.component.scss'],
  standalone: true,
  imports: [MatIconButton, DatePipe]
})
export class OutageBannerComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<boolean>(true);
  public outageInfo: OutageInformation;

  constructor(private outageService: OutageService) {}

  ngOnInit(): void {
    this.outageInfo = this.outageService?.outageInfo;
  }

  public closeOutageBanner() {
    this.closeEvent.emit(false);
  }
}
