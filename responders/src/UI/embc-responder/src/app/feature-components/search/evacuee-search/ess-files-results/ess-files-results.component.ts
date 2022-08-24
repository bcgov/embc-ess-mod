import {
  AfterViewChecked,
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
import { HouseholdMemberType } from 'src/app/core/api/models';
import { AddressModel } from 'src/app/core/models/address.model';
import { EvacuationFileSearchResultModel } from 'src/app/core/models/evacuee-search-results';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { Community } from 'src/app/core/services/locations.service';
import { EvacueeSearchService } from '../../evacuee-search/evacuee-search.service';
import * as globalConst from '../../../../core/services/global-constants';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { EssFileSecurityPhraseService } from '../../essfile-security-phrase/essfile-security-phrase.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { EssFilesResultsService } from './ess-files-results.service';

@Component({
  selector: 'app-ess-files-results',
  templateUrl: './ess-files-results.component.html',
  styleUrls: ['./ess-files-results.component.scss']
})
export class EssFilesResultsComponent
  implements OnInit, OnChanges, AfterViewInit, AfterViewChecked
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() fileResults: Array<EvacuationFileSearchResultModel>;
  matchedFiles = new MatTableDataSource();
  matchedFiles$: Observable<Array<EvacuationFileSearchResultModel>>;

  constructor(
    private evacueeSearchService: EvacueeSearchService,
    private evacueeSessionService: EvacueeSessionService,
    private essFileSecurityPhraseService: EssFileSecurityPhraseService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private alertService: AlertService,
    private appBaseService: AppBaseService,
    private essFilesResultsService: EssFilesResultsService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fileResults) {
      this.matchedFiles = new MatTableDataSource(this.fileResults);
      this.matchedFiles.paginator = this.paginator;
      this.matchedFiles$ = this.matchedFiles.connect();
    }
  }

  ngAfterViewInit(): void {
    this.matchedFiles.paginator = this.paginator;
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngOnInit(): void {}

  /**
   * Navigates to next step based on user verified status
   *
   * @param selectedESSFile selected ess file
   */
  async openESSFile(selectedESSFile: EvacuationFileSearchResultModel) {
    this.essFilesResultsService.setSelectedFile(selectedESSFile.id);
    const profile$ = await this.essFilesResultsService.getSearchedUserProfile(
      selectedESSFile
    );
    if (this.evacueeSessionService.isPaperBased) {
      if (
        this.evacueeSearchService?.evacueeSearchContext?.evacueeSearchParameters
          ?.paperFileNumber !== selectedESSFile.manualFileId
      ) {
        this.essFilesResultsService.openUnableAccessESSFileDialog();
      } else {
        this.router.navigate(['responder-access/search/essfile-dashboard']);
      }
    } else {
      if (
        !this.evacueeSearchService.evacueeSearchContext
          .hasShownIdentification &&
        !selectedESSFile.isFileCompleted
      ) {
        this.essFilesResultsService.openUnableAccessDialog();
      } else if (
        !this.evacueeSearchService.evacueeSearchContext.hasShownIdentification
      ) {
        this.essFilesResultsService.setloadingOverlay(true);
        this.essFileSecurityPhraseService
          .getSecurityPhrase(this.appBaseService?.appModel?.selectedEssFile?.id)
          .subscribe({
            next: (results) => {
              this.essFilesResultsService.setloadingOverlay(false);
              this.essFileSecurityPhraseService.securityPhrase = results;
              setTimeout(() => {
                this.router.navigate([
                  'responder-access/search/security-phrase'
                ]);
              }, 200);
            },
            error: (error) => {
              this.essFilesResultsService.setloadingOverlay(false);
              this.alertService.clearAlert();
              this.alertService.setAlert(
                'danger',
                globalConst.securityPhraseError
              );
            }
          });
      } else {
        this.router.navigate(['responder-access/search/essfile-dashboard']);
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

  /**
   * Determines the type of household member
   *
   * @param type member type
   * @param isMainApplicant true/false
   * @returns derived member type
   */
  getMemberType(type: string, isMainApplicant: boolean): string {
    if (type === HouseholdMemberType.Registrant && isMainApplicant) {
      return globalConst.mainApplicant;
    } else if (type === HouseholdMemberType.Registrant && !isMainApplicant) {
      return HouseholdMemberType.Registrant;
    } else {
      return type;
    }
  }
}
