import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-outage',
  templateUrl: './outage.component.html',
  styleUrls: ['./outage.component.scss']
})
export class OutageComponent implements OnInit {
  @Input() description: string;
  @Input() startDate: string;
  @Input() endDate: string;

  constructor() {}

  ngOnInit(): void {}
}
