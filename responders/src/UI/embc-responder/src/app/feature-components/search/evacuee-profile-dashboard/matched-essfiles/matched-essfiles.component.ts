import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-matched-essfiles',
  templateUrl: './matched-essfiles.component.html',
  styleUrls: ['./matched-essfiles.component.scss']
})
export class MatchedEssfilesComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  currentlyOpenedItemIndex = -1;

  essFiles = [
    {
      fileNumber: '12345',
      taskNumber: '34567',
      startDate: '20-Mar-2021',
      endDate: '23-Mar-2021',
      createdDate: '20-Mar-2021',
      evacuatedFrom: 'something',
      status: 'active'
    },
    {
      fileNumber: '12345',
      taskNumber: '34567',
      startDate: '20-Mar-2021',
      endDate: '23-Mar-2021',
      createdDate: '20-Mar-2021',
      evacuatedFrom: 'something',
      status: 'pending'
    },
    {
      fileNumber: '12345',
      taskNumber: '34567',
      startDate: '20-Mar-2021',
      endDate: '23-Mar-2021',
      createdDate: '20-Mar-2021',
      evacuatedFrom: 'something',
      status: 'expired'
    },
    {
      fileNumber: '12345',
      taskNumber: '34567',
      startDate: '20-Mar-2021',
      endDate: '23-Mar-2021',
      createdDate: '20-Mar-2021',
      evacuatedFrom: 'something',
      status: 'complete'
    }
  ];
  constructor() {}

  ngOnInit(): void {}

  /**
   * Sets expanded input value for panel
   *
   * @param index
   * @returns
   */
  isExpanded(index: number): boolean {
    return index === 0;
  }

  /**
   * Updates value of openend file index
   *
   * @param itemIndex selected file index
   */
  setOpened(itemIndex: number): void {
    this.currentlyOpenedItemIndex = itemIndex;
  }

  /**
   * Resets the opened file index to default
   *
   * @param itemIndex closed file index
   */
  setClosed(itemIndex: number): void {
    if (this.currentlyOpenedItemIndex === itemIndex) {
      this.currentlyOpenedItemIndex = -1;
    }
  }
}
