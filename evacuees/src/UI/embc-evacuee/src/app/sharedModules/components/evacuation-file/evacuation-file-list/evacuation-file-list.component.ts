import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvacuationFile } from 'src/app/core/api/models';
import { DialogService } from 'src/app/core/services/dialog.service';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { EvacuationFileDataService } from '../evacuation-file-data.service';
import { EvacuationFileService } from '../evacuation-file.service';
import * as moment from 'moment';

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
  currentChild: EvacuationFile;
  dataSourceActive: Array<EvacuationFile>;
  dataSourceInactive: Array<EvacuationFile>;
  showLoading = false;

  constructor(
    private route: ActivatedRoute, public formCreationService: FormCreationService,
    private dialogService: DialogService, private evacuationFileService: EvacuationFileService,
    private evacuationFileDataService: EvacuationFileDataService) { }

  ngOnInit(): void {

    this.currentPath = window.location.pathname;

    if (this.currentPath === '/verified-registration/dashboard/current') {
      this.showLoading = true;
      this.evacuationFileService.getCurrentEvacuationFiles().subscribe(files => {
        this.dataSourceActive = files;
        this.dataSourceActive.sort((a, b) => new Date(b.evacuationFileDate).valueOf() - new Date(a.evacuationFileDate).valueOf());
        console.log(this.dataSourceActive);
        this.evacuationFileDataService.setCurrentEvacuationFileCount(files.length);
        this.evacuatedFrom = this.dataSourceActive[0].evacuatedFromAddress.jurisdiction.name;
        this.showLoading = false;
      });

    } else if (this.currentPath === '/verified-registration/dashboard/past') {
      this.showLoading = true;
      this.evacuationFileService.getPastEvacuationFiles().subscribe(files => {
        this.dataSourceInactive = files;
        this.dataSourceInactive.sort((a, b) => new Date(b.evacuationFileDate).valueOf() - new Date(a.evacuationFileDate).valueOf());
        // console.log(this.dataSourceInactive);
        this.showLoading = false;
      });
    }
  }

  startAdditionalAssessment(): void {
    this.dialogService.addEvacuationFile(this.evacuatedFrom);
  }
}
