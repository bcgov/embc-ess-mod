import { Component, OnDestroy, OnInit } from '@angular/core';
import { TabModel } from 'src/app/core/models/tab.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { AssignedCommunityListDataService } from '../assigned-community-list/assigned-community-list-data.service';

@Component({
  selector: 'app-assigned-community-management',
  templateUrl: './assigned-community-management.component.html',
  styleUrls: ['./assigned-community-management.component.scss']
})
export class AssignedCommunityManagementComponent implements OnInit, OnDestroy {

  tabs: TabModel[] = [
    {
      label: 'Community List',
      route: 'list',
    },
    // {
    //   label: 'Add/Edit Community List',
    //   route: 'add-edit',
    // }
  ];

  constructor(private cacheService: CacheService) { }

  ngOnDestroy(): void {
    console.log('**************ON-DESTROY***************');
    this.cacheService.remove('allTeamCommunityList');
    this.cacheService.remove('teamCommunityList');
  }

  ngOnInit(): void {

  }

}
