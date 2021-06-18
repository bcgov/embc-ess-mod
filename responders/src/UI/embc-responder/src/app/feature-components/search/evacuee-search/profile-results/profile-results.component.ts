import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RegistrantProfileSearchResult } from 'src/app/core/api/models';
import { AddressModel } from 'src/app/core/models/address.model';
import { RegistrantProfileSearchResultModel } from 'src/app/core/models/evacuee-search-results';
import { Community } from 'src/app/core/services/locations.service';
import { EvacueeSearchService } from '../../evacuee-search/evacuee-search.service';

@Component({
  selector: 'app-profile-results',
  templateUrl: './profile-results.component.html',
  styleUrls: ['./profile-results.component.scss']
})
export class ProfileResultsComponent
  implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() registrantResults: Array<RegistrantProfileSearchResultModel>;
  matchedRegistrants = new MatTableDataSource();
  matchedRegistrants$: Observable<Array<RegistrantProfileSearchResultModel>>;
  color = '#169BD5';

  constructor(
    private evacueeSearchService: EvacueeSearchService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.registrantResults) {
      this.matchedRegistrants = new MatTableDataSource(this.registrantResults);
      this.matchedRegistrants.paginator = this.paginator;
      this.matchedRegistrants$ = this.matchedRegistrants.connect();
    }
  }

  ngAfterViewInit(): void {
    this.matchedRegistrants.paginator = this.paginator;
    this.cd.detectChanges();
  }

  ngOnInit(): void {}

  openProfile(selectedRegistrant: RegistrantProfileSearchResultModel): void {
    if (this.evacueeSearchService.evacueeSearchContext.hasShownIdentification) {
      this.router.navigate([
        'responder-access/search/evacuee-profile-dashboard'
      ]);
    } else {
      this.evacueeSearchService.profileId = selectedRegistrant.id;
      this.router.navigate(['responder-access/search/security-questions']);
    }
  }

  communityName(address: AddressModel): string {
    return (address.community as Community).name;
  }
}
