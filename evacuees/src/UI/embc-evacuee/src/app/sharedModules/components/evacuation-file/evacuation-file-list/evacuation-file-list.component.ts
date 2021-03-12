import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NeedsAssessment } from 'src/app/core/api/models';
import { CacheService } from 'src/app/core/services/cache.service';
import { DataService } from 'src/app/core/services/data.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { EvacuationFileDataService } from '../evacuation-file-data.service';
import { EvacuationFileService } from '../evacuation-file.service';

@Component({
  selector: 'app-evacuation-file-list',
  templateUrl: './evacuation-file-list.component.html',
  styleUrls: ['./evacuation-file-list.component.scss']
})
export class EvacuationFileListComponent implements OnInit {

  currentPath: string;
  evacuatedFrom: string;
  showActiveList = true;
  showInactiveList = true;
  currentChild: NeedsAssessment;
  dataSourceActive: Array<NeedsAssessment>;
  dataSourceInactive: Array<NeedsAssessment>;
  showLoading = false;

  constructor(
    private route: ActivatedRoute, private dataService: DataService, public formCreationService: FormCreationService,
    private router: Router, private dialogService: DialogService, private evacuationFileService: EvacuationFileService,
    private evacuationFileDataService: EvacuationFileDataService) { }

  ngOnInit(): void {

    this.currentPath = window.location.pathname;

    if (this.currentPath === '/verified-registration/dashboard/current') {
      this.showLoading = true;
      this.evacuationFileService.getCurrentEvacuationFile().subscribe(files => {
        this.dataSourceActive = files;
        this.evacuationFileDataService.setCurrentEvacuationFileCount(files.length);
        this.showLoading = false;
      });

    } else if (this.currentPath === '/verified-registration/dashboard/past') {
      this.showLoading = true;
      this.evacuationFileService.getPastEvacuationFile().subscribe(files => {
        this.dataSourceInactive = files;
        this.showLoading = false;
      });
    }
  }

  startAdditionalAssessment(): void {
    this.dialogService.addEvacuationFile(this.evacuatedFrom);
  }


  setActiveListView(event: boolean): void {
    this.showActiveList = event;
  }

  setInactiveListView(event: boolean): void {
    this.showInactiveList = event;
  }

  setCurrentChild(fileCard: NeedsAssessment): void {
    this.currentChild = fileCard;
  }

  goBackActive(): void {
    this.showActiveList = !this.showActiveList;
  }

  goBackInactive(): void {
    this.showInactiveList = !this.showInactiveList;
  }

  resetTab($event): void {
    this.showActiveList = true;
    this.showInactiveList = true;
  }
}
