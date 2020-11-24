import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-auth-profile',
  templateUrl: './view-auth-profile.component.html',
  styleUrls: ['./view-auth-profile.component.scss']
})
export class ViewAuthProfileComponent implements OnInit {

  type = 'profile';
  currentFlow: string;
  parentPageName = 'view-profile';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
  }

}
