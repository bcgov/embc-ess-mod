import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  AfterViewInit
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { EvacuationFileDataService } from '../evacuation-file-data.service';
import { EvacuationFileService } from '../evacuation-file.service';
import { EvacuationFileStatus, Support } from 'src/app/core/api/models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-evacuation-details',
  templateUrl: './evacuation-details.component.html',
  styleUrls: ['./evacuation-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvacuationDetailsComponent implements OnInit, AfterViewInit {
  @Input() allExpandState = false;
  previousUrl: string;
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

  constructor(
    public formCreationService: FormCreationService,
    public evacuationFilesService: EvacuationFileService,
    private router: Router,
    public evacuationFileDataService: EvacuationFileDataService,
    private datePipe: DatePipe,
    private cd: ChangeDetectorRef
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.previousUrl = event.url;
      });
  }

  ngOnInit(): void {
    if (this.previousUrl?.includes('current')) {
      this.evacuationFileTab = 'Current';
    } else {
      this.evacuationFileTab = 'Past';
    }

    if (this.evacuationFileDataService?.supports?.length > 0) {
      this.referralData = this.splitReferralsByDate(
        this.evacuationFileDataService?.supports
      );
    }
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  changeStatusColor(): string {
    if (
      this.evacuationFileDataService.evacuationFileStatus ===
        EvacuationFileStatus.Active ||
      this.evacuationFileDataService.evacuationFileStatus ===
        EvacuationFileStatus.Pending
    ) {
      return '#26B378';
    } else {
      return '#8B0000';
    }
  }

  goToCurrent(): void {
    if (this.previousUrl.includes('current')) {
      this.router.navigate(['/verified-registration/dashboard/current']);
    } else {
      this.router.navigate(['/verified-registration/dashboard/past']);
    }
  }

  allowEdition(): boolean {
    if (
      this.evacuationFileDataService.evacuationFileStatus ===
        EvacuationFileStatus.Expired ||
      this.evacuationFileDataService.evacuationFileStatus ===
        EvacuationFileStatus.Pending
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
    referrals.sort(
      (a, b) => new Date(b.issuedOn).valueOf() - new Date(a.issuedOn).valueOf()
    );

    //Grouping based on Issued on date
    const groupedReferrals: Map<string, Support[]> = new Map<
      string,
      Support[]
    >();
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
