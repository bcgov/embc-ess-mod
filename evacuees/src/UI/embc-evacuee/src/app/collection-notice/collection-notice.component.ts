import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collection-notice',
  templateUrl: './collection-notice.component.html',
  styleUrls: ['./collection-notice.component.scss']
})
export class CollectionNoticeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  submitNotice() :void {
    this.router.navigate(['/restriction']);
  }

}
