import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OutageInformation } from 'src/app/core/api/models/outage-information';
import { OutageService } from 'src/app/feature-components/outage/outage.service';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-outage-banner',
  templateUrl: './outage-banner.component.html',
  styleUrls: ['./outage-banner.component.scss'],
  standalone: true,
  imports: [MatButtonModule, DatePipe]
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
