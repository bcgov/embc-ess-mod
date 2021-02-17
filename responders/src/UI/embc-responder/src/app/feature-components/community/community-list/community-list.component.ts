import { Component, OnInit } from '@angular/core';
import { TableColumnModel } from 'src/app/core/models/table-column.model';

@Component({
  selector: 'app-community-list',
  templateUrl: './community-list.component.html',
  styleUrls: ['./community-list.component.scss']
})
export class CommunityListComponent implements OnInit {

  constructor() { }

  displayedColumns: TableColumnModel[] = [
    {label: 'Community', ref: 'community'},
    {label: 'Regional District', ref: 'regionalDistrict'},
    {label: 'Type', ref: 'type'},
    {label: 'Date Added to List', ref: 'date'},
  ];

  sampleCommunityData = [
    {community: 'Community Name', regionalDistrict: 'Regional District Name', type: 'First Nations Community', date: 'mm/dd/yyyy'},
    {community: 'Community Name', regionalDistrict: 'Regional District Name', type: 'First Nations Community', date: 'mm/dd/yyyy'},
    {community: 'Community Name', regionalDistrict: 'Regional District Name', type: 'First Nations Community', date: 'mm/dd/yyyy'}
  ];

  ngOnInit(): void {
  }

}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
