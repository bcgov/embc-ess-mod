import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OutageInformation } from 'src/app/core/api/models';
import { OutageService } from '../../../feature-components/outage/outage.service';

@Component({
  selector: 'app-outage-banner',
  templateUrl: './outage-banner.component.html',
  styleUrls: ['./outage-banner.component.scss']
})
export class OutageBannerComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<boolean>(true);
  outageInfo: OutageInformation;

  constructor(public outageService: OutageService) { }

  ngOnInit(): void {
  }

  public closeOutageBanner() {
    this.closeEvent.emit(false);
  }
}
