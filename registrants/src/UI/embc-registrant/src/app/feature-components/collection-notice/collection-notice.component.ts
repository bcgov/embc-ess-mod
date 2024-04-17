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
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  /**
   * Initializes the user flow and form group
   */
  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
  }

  /**
   * If the consent for collection is not met, opens a popup else
   * navigates to the next page
   */
  submitNotice(): void {
    const navigationPath = '/' + this.currentFlow + '/restriction';
    this.router.navigate([navigationPath]);
  }
}
