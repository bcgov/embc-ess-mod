import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OutageInformation } from 'src/app/core/api/models/outage-information';
import { OutageService } from 'src/app/feature-components/outage/outage.service';

@Component({
  selector: 'app-outage-banner',
  templateUrl: './outage-banner.component.html',
  styleUrls: ['./outage-banner.component.scss']
})
export class OutageBannerComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<boolean>(true);
  outageInfo: OutageInformation;

  constructor(private outageService: OutageService) {}

  ngOnInit(): void {
    this.outageService.getOutageInformation().subscribe((outageInfo) => {
      this.outageInfo = outageInfo;
    });
  }

  public closeOutageBanner() {
    this.closeEvent.emit(false);
  }
}
