import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-auth-profile',
  templateUrl: './view-auth-profile.component.html',
  styleUrls: ['./view-auth-profile.component.scss']
})
export class ViewAuthProfileComponent implements OnInit {

  type="profile";

  constructor() { }

  ngOnInit(): void {
  }

}
