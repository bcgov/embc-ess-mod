import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-collection-notice',
  templateUrl: './collection-notice.component.html',
  styleUrls: ['./collection-notice.component.scss']
})
export class CollectionNoticeComponent implements OnInit {

  currentFlow: string;

  constructor(
    private router: Router, public dialog: MatDialog,
    private route: ActivatedRoute) { }

  /**
   * Initializes the user flow and form group
   */
  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    // this.collectionForm = this.builder.group({
    //   informationCollectionConsent: [false]
    // });
    // this.mapData();
  }

  /**
   * Pre-populates the form with existing data
   */
  // mapData(): void {
  //   const existingValues = this.dataService.getRegistration();
  //   if (existingValues !== null) {
  //     this.collectionForm.get('informationCollectionConsent').setValue(existingValues.informationCollectionConsent);
  //   }
  // }

  /**
   * If the consent for collection is not met, opens a popup else
   * navigates to the next page
   */
  submitNotice(): void {
    // if (!this.collectionForm.get('informationCollectionConsent').value) {
    //   this.dialog.open(DialogComponent, {
    //     data: globalConst.noticeBody,
    //     height: '220px',
    //     width: '500px'
    //   });
    // } else {
    //   this.dataService.updateRegistartion(this.collectionForm.value);
    const navigationPath = '/' + this.currentFlow + '/restriction';
    this.router.navigate([navigationPath]);
    // }
  }

}
