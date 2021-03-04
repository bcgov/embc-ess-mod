import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router, RouterEvent } from '@angular/router';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { DataService } from 'src/app/core/services/data.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { filter, first, shareReplay } from 'rxjs/operators';
import { CacheService } from 'src/app/core/services/cache.service';
import { EvacuationFileService } from '../evacuation-file/evacuation-file.service';
import { TabModel } from 'src/app/core/model/tab.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {

  currentFlow: string;

  tabs: TabModel[] = [
    {
      label: 'Current Evacuations',
      route: 'current',
      activeImage: '/assets/images/curr-evac-active.svg',
      inactiveImage: '/assets/images/curr-evac.svg'
    },
    {
      label: 'Past Evacuations',
      route: 'past',
      activeImage: '/assets/images/past-evac-active.svg',
      inactiveImage: '/assets/images/past-evac.svg'
    },
    {
      label: 'User Profile',
      route: 'profile',
      activeImage: '/assets/images/profile-active.svg',
      inactiveImage: '/assets/images/profile.svg'
    }
  ];


  constructor(
    private route: ActivatedRoute, private dataService: DataService, public formCreationService: FormCreationService,
    private router: Router, private dialogService: DialogService, private cacheService: CacheService,
    private evacuationFilesService: EvacuationFileService) { }


  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    console.log(this.currentFlow);

    this.evacuationFilesService.getCurrentEvacuationFiles();
    this.evacuationFilesService.getPastEvacuationFiles();

    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof ActivationEnd),
      first()
    ).subscribe((event: any) => {
      console.log(event);
      this.cacheService.set('previousComponent', event.snapshot.component.name);
    });

    if (this.cacheService.get('previousComponent') === 'EditComponent') {
      // this.tabIndex = 2;
    }

    setTimeout(() => {
      this.openReferenceNumberPopup();
    }, 500);
  }

  openDOBMismatchPopup(): void {
    this.dialogService.dateOfBirthMismatch('02 Mar 1984', '02 Mar 1983');
  }

  openReferenceNumberPopup(): void {

    const registrationResult = this.dataService.getRegistrationResult();

    if (registrationResult.referenceNumber !== null) {
      this.dialogService.submissionCompleteDialog(registrationResult.referenceNumber);
    }
  }

  startAssessment(): void {
    this.router.navigate(['/verified-registration/confirm-restriction']);
  }
}
