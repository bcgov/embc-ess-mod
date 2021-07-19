import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { FileStatusDefinitionComponent } from 'src/app/shared/components/dialog-components/file-status-definition/file-status-definition.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

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
  constructor(private dialog: MatDialog) {}

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

  /**
   * Open the dialog with definition of
   * profile status
   */
  openStatusDefinition(): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: FileStatusDefinitionComponent,
        content: 'All'
      },
      height: '650px',
      width: '500px'
    });
  }
}
