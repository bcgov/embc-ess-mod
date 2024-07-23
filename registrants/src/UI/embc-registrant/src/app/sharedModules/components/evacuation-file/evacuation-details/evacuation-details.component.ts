import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { EvacuationFileDataService } from '../evacuation-file-data.service';
import { EvacuationFileService } from '../evacuation-file.service';
import { EvacuationFileStatus, Support } from 'src/app/core/api/models';
import { DatePipe, NgClass, AsyncPipe } from '@angular/common';
import { MaskEvacuatedAddressPipe } from '../../../../core/pipe/maskEvacuatedAddress.pipe';
import { ReferralDetailsComponent } from '../referral-details/referral-details.component';
import { ReviewComponent } from '../../../../feature-components/review/review.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { EvacuationFileMappingService } from '../evacuation-file-mapping.service';

@Component({
  selector: 'app-evacuation-details',
  templateUrl: './evacuation-details.component.html',
  styleUrls: ['./evacuation-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    NgClass,
    ReviewComponent,
    ReferralDetailsComponent,
    AsyncPipe,
    DatePipe,
    MaskEvacuatedAddressPipe
  ]
})
export class EvacuationDetailsComponent implements OnInit, AfterViewInit {
  EvacuationFileStatus = EvacuationFileStatus;
  @Input() allExpandState = false;
  evacuationFileTab: string;
  backArrowImgSrc = '/assets/images/back_arrow.svg';
  type = 'need';
  currentFlow: string;
  parentPageName = 'needs-assessment';
  referralDetailsText = 'expand all';
  referralData = new Map<string, Support[]>();
  showActiveList = true;
  showInactiveList = true;
  displayStatus: string;
  showSupports = false;
  isActive = false;
  isPending = false;

  constructor(
    public formCreationService: FormCreationService,
    public evacuationFilesService: EvacuationFileService,
    private router: Router,
    public evacuationFileDataService: EvacuationFileDataService,
    private datePipe: DatePipe,
    private cd: ChangeDetectorRef,
    private evacuationFileMappingService: EvacuationFileMappingService
  ) {}

  ngOnInit(): void {
    if (this.router.url?.includes('current')) {
      this.evacuationFileTab = 'Current';
    } else {
      this.evacuationFileTab = 'Past';
    }
    if (this.evacuationFileDataService?.supports?.length > 0) {
      this.showSupports = true;
      this.referralData = this.splitReferralsByDate(this.evacuationFileDataService?.supports);
    }
    if (this.evacuationFileDataService.evacuationFileStatus === EvacuationFileStatus.Active) this.isActive = true;
    else if (this.evacuationFileDataService.evacuationFileStatus === EvacuationFileStatus.Pending)
      this.isPending = true;
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  changeStatusColor(): string {
    if (
      this.evacuationFileDataService.evacuationFileStatus === EvacuationFileStatus.Active ||
      this.evacuationFileDataService.evacuationFileStatus === EvacuationFileStatus.Pending
    ) {
      return '#26B378';
    } else {
      return '#8B0000';
    }
  }

  goToCurrent(): void {
    if (this.router.url.includes('current')) {
      this.router.navigate(['/verified-registration/dashboard/current']);
    } else {
      this.router.navigate(['/verified-registration/dashboard/past']);
    }
  }

  gotoUpdateDetails() {
    this.evacuationFilesService.getCurrentEvacuationFiles().subscribe((files) => {
      const file = files.find((f) => f.fileId === this.evacuationFileDataService.essFileId);
      if (!file) {
        console.error('No current evacuation file found');
        return;
      }
      this.evacuationFileMappingService.mapEvacuationFile(file);
      this.router.navigate([
        '/verified-registration/needs-assessment',
        this.evacuationFileDataService.essFileId,
        'update'
      ]);
    });
  }

  allowEdition(): boolean {
    if (
      this.evacuationFileDataService.evacuationFileStatus === EvacuationFileStatus.Expired ||
      this.evacuationFileDataService.evacuationFileStatus === EvacuationFileStatus.Pending
    ) {
      return true;
    } else {
      return false;
    }
  }

  onMouseOver(): void {
    this.backArrowImgSrc = '/assets/images/back_arrow_hover.svg';
  }

  onMouseOut(): void {
    this.backArrowImgSrc = '/assets/images/back_arrow.svg';
  }

  expandDetails(): void {
    this.allExpandState = !this.allExpandState;
  }

  private splitReferralsByDate(referrals: Support[]): Map<string, Support[]> {
    //Sorting referrals by Issued On Asc
    referrals.sort((a, b) => new Date(b.issuedOn).valueOf() - new Date(a.issuedOn).valueOf());

    //Grouping based on Issued on date
    const groupedReferrals: Map<string, Support[]> = new Map<string, Support[]>();
    referrals.forEach((item) => {
      const date: Date = new Date(item.issuedOn);
      const displayedDate = this.datePipe.transform(date, 'dd-MMM-yyyy');
      let supports: Support[] = [];
      if (groupedReferrals.get(displayedDate)) {
        supports = groupedReferrals.get(displayedDate);
        supports.push(item);
        groupedReferrals.set(displayedDate, supports);
      } else {
        supports = [];
        supports.push(item);
        groupedReferrals.set(displayedDate, supports);
      }
    });

    return groupedReferrals;
  }
}
