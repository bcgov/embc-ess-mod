import { Component, OnInit } from '@angular/core';
import { OutageInformation } from 'src/app/core/api/models';
import { OutageService } from './outage.service';

@Component({
  selector: 'app-outage',
  templateUrl: './outage.component.html',
  styleUrls: ['./outage.component.scss']
})
export class OutageComponent implements OnInit {
  public outageInfo: OutageInformation;
  constructor(public outageService: OutageService) {}

  ngOnInit(): void {}
}
