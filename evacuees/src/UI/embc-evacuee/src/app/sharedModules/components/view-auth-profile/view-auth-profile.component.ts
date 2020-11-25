import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormCreationService } from 'src/app/core/services/formCreation.service';

@Component({
  selector: 'app-view-auth-profile',
  templateUrl: './view-auth-profile.component.html',
  styleUrls: ['./view-auth-profile.component.scss']
})
export class ViewAuthProfileComponent implements OnInit {

  type = 'profile';
  currentFlow: string;
  parentPageName = 'view-profile';

  constructor(private route: ActivatedRoute, public formCreationService: FormCreationService) { }

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
  }

}
