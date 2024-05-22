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
import { Observable, firstValueFrom } from 'rxjs';
import { AddressModel } from 'src/app/core/models/address.model';
import { RegistrantProfileSearchResultModel } from 'src/app/core/models/evacuee-search-results';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { Community } from 'src/app/core/services/locations.service';
import { EvacueeSearchService } from '../../evacuee-search/evacuee-search.service';
import * as globalConst from '../../../../core/services/global-constants';
import { ProfileSecurityQuestionsService } from '../../profile-security-questions/profile-security-questions.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { ProfileResultsService } from './profile-results.service';
import { MaskFullAddressPipe } from '../../../../shared/pipes/maskFullAddress.pipe';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgClass, AsyncPipe, UpperCasePipe, TitleCasePipe, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import {
  AccessReasonData,
  AccessReasonGateDialogComponent
} from '../access-reason-gate-dialog/access-reason-gate-dialog.component';

@Component({
  selector: 'app-profile-results',
  templateUrl: './profile-results.component.html',
  styleUrls: ['./profile-results.component.scss'],
  standalone: true,
  imports: [
    MatCard,
    NgClass,
    MatCardContent,
    MatPaginator,
    AsyncPipe,
    UpperCasePipe,
    TitleCasePipe,
    DatePipe,
    MaskFullAddressPipe
  ]
})
export class ProfileResultsComponent implements OnChanges, AfterViewInit {
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
    private profileSecurityQuestionsService: ProfileSecurityQuestionsService,
    private alertService: AlertService,
    private appBaseService: AppBaseService,
    private profileResultsService: ProfileResultsService,
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

  /**
   * Navigates to next step based on user verified status
   *
   * @param selectedRegistrant selected profile
   */
  async openProfile(selectedRegistrant: RegistrantProfileSearchResultModel) {
    const shouldProceed = await firstValueFrom(
      this.dialog
        .open<AccessReasonGateDialogComponent, AccessReasonData, boolean>(AccessReasonGateDialogComponent, {
          data: {
            accessEntity: 'profile',
            entityId: selectedRegistrant.id
          }
        })
        .afterClosed()
    );

    if (!shouldProceed) return;

    if (
      this.evacueeSessionService.isPaperBased &&
      !this.evacueeSearchService.evacueeSearchContext.hasShownIdentification
    ) {
      this.profileResultsService.openUnableAccessDialog();
    } else {
      this.profileResultsService.updateProfile(selectedRegistrant);
      if (this.evacueeSearchService.evacueeSearchContext.hasShownIdentification) {
        this.router.navigate(['responder-access/search/evacuee-profile-dashboard']);
      } else {
        this.profileResultsService.setloadingOverlay(true);
        this.profileSecurityQuestionsService
          .getSecurityQuestions(this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext?.id)
          .subscribe({
            next: (results) => {
              this.profileResultsService.setloadingOverlay(false);
              if (results.questions.length === 0) {
                this.profileResultsService.openUnableAccessDialog();
              } else {
                this.profileSecurityQuestionsService.shuffleSecurityQuestions(results?.questions);
                this.evacueeSessionService.securityQuestionsOpenedFrom = 'responder-access/search/evacuee';
                setTimeout(() => {
                  this.router.navigate(['responder-access/search/security-questions']);
                }, 200);
              }
            },
            error: (error) => {
              this.profileResultsService.setloadingOverlay(false);
              this.alertService.clearAlert();
              this.alertService.setAlert('danger', globalConst.securityQuestionsError);
            }
          });
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
}
