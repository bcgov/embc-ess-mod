import { Component, OnInit, Type } from '@angular/core';
import { CollectionNoticeComponent } from '../core/components/collection-notice/collection-notice.component';

@Component({
  selector: 'app-pre-registration',
  templateUrl: './pre-registration.component.html',
  styleUrls: ['./pre-registration.component.scss']
})
export class PreRegistrationComponent implements OnInit {

  componentToLoad: Promise<Type<CollectionNoticeComponent>>;

  constructor() { }

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent() {
    if(!this.componentToLoad) {
      this.componentToLoad = import(`../core/components/collection-notice/collection-notice.component`).then(
        ({CollectionNoticeComponent}) => CollectionNoticeComponent
      )
    }
  }

}
