import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-possible-matched-essfiles',
  templateUrl: './possible-matched-essfiles.component.html',
  styleUrls: ['./possible-matched-essfiles.component.scss']
})
export class PossibleMatchedEssfilesComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  currentlyOpenedItemIndex = -1;

  essFiles = [
    {
      fileNumber: '12345',
      createdDate: '20-Mar-2021',
      evacuatedFrom: 'something',
      status: 'pending'
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
