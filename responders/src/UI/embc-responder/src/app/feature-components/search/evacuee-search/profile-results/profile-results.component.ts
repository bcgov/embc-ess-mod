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
import { ProfileSecurityQuestionsService } from '../../profile-security-questions/profile-security-questions.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { EvacueeSearchResultsService } from '../evacuee-search-results/evacuee-search-results.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';

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
    private dialog: MatDialog,
    private profileSecurityQuestionsService: ProfileSecurityQuestionsService,
    private alertService: AlertService,
    private evacueeSearchResultsService: EvacueeSearchResultsService,
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService
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
      this.evacueeSessionService.isPaperBased &&
      this.evacueeSearchService.evacueeSearchContext.hasShownIdentification ===
        false
    ) {
      this.openUnableAccessDialog();
    } else {
      const profileIdObject: RegistrantProfileModel = {
        id: selectedRegistrant.id,
        primaryAddress: null,
        mailingAddress: null,
        personalDetails: null,
        contactDetails: null,
        restriction: null
      };
      this.appBaseService.appModel = {
        selectedProfile: { selectedEvacueeInContext: profileIdObject }
      };
      this.computeState.triggerEvent();
      //this.evacueeSessionService.profileId = selectedRegistrant.id;
      if (
        this.evacueeSearchService.evacueeSearchContext.hasShownIdentification
      ) {
        this.router.navigate([
          'responder-access/search/evacuee-profile-dashboard'
        ]);
      } else {
        this.evacueeSearchResultsService.setloadingOverlay(true);
        this.profileSecurityQuestionsService
          .getSecurityQuestions(
            this.appBaseService?.appModel?.selectedProfile
              ?.selectedEvacueeInContext?.id
          )
          .subscribe({
            next: (results) => {
              this.evacueeSearchResultsService.setloadingOverlay(false);
              if (results.questions.length === 0) {
                this.openUnableAccessDialog();
              } else {
                this.profileSecurityQuestionsService.shuffleSecurityQuestions(
                  results?.questions
                );
                this.evacueeSessionService.securityQuestionsOpenedFrom =
                  'responder-access/search/evacuee';
                setTimeout(() => {
                  this.router.navigate([
                    'responder-access/search/security-questions'
                  ]);
                }, 200);
              }
            },
            error: (error) => {
              this.evacueeSearchResultsService.setloadingOverlay(false);
              this.alertService.clearAlert();
              this.alertService.setAlert(
                'danger',
                globalConst.securityQuestionsError
              );
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
