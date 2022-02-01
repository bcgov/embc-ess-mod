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
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AddressModel } from 'src/app/core/models/address.model';
import { RegistrantProfileSearchResultModel } from 'src/app/core/models/evacuee-search-results';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { Community } from 'src/app/core/services/locations.service';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { EvacueeSearchService } from '../../evacuee-search/evacuee-search.service';
import * as globalConst from '../../../../core/services/global-constants';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-profile-results',
  templateUrl: './profile-results.component.html',
  styleUrls: ['./profile-results.component.scss']
})
export class ProfileResultsComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() registrantResults: Array<RegistrantProfileSearchResultModel>;
  matchedRegistrants = new MatTableDataSource();
  matchedRegistrants$: Observable<Array<RegistrantProfileSearchResultModel>>;
  color = '#169BD5';

  constructor(
    private evacueeSearchService: EvacueeSearchService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private evacueeSessionService: EvacueeSessionService,
    private dialog: MatDialog
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

  /**
   * Navigates to next step based on user verified status
   *
   * @param selectedRegistrant selected profile
   */
  openProfile(selectedRegistrant: RegistrantProfileSearchResultModel): void {
    if (
      this.evacueeSessionService.paperBased === true &&
      this.evacueeSearchService.evacueeSearchContext.hasShownIdentification ===
        false
    ) {
      this.openUnableAccessDialog();
    } else {
      this.evacueeSessionService.profileId = selectedRegistrant.id;
      if (
        this.evacueeSearchService.evacueeSearchContext.hasShownIdentification
      ) {
        this.router.navigate([
          'responder-access/search/evacuee-profile-dashboard'
        ]);
      } else {
        this.evacueeSessionService.securityQuestionsOpenedFrom =
          'responder-access/search/evacuee';
        this.router.navigate(['responder-access/search/security-questions']);
      }
    }
  }

  /**
   * Returns community name
   *
   * @param address complete address model
   * @returns community name
   */
  communityName(address: AddressModel): string {
    return (address.community as Community).name;
  }

  public openUnableAccessDialog(): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: globalConst.unableAccessFileMessage
      },
      height: '285px',
      width: '493px'
    });
  }
}
