import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OutageInformation } from 'src/app/core/api/models';
import { OutageService } from './outage.service';

@Component({
  selector: 'app-outage',
  templateUrl: './outage.component.html',
  styleUrls: ['./outage.component.scss']
})
export class OutageComponent implements OnInit {
  public outageType: string;
  public outageInfo: OutageInformation;

  constructor(private outageService: OutageService, private router: Router) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state;
        this.outageType = state.type;
      }
    }
  }

  ngOnInit(): void {
    this.outageInfo = this.outageService.outageInfo;
  }
}
