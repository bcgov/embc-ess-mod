import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EssFileDialogComponent } from 'src/app/core/components/dialog-components/ess-file-dialog/ess-file-dialog.component';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { EvacuationFileDataService } from '../evacuation-file-data.service';
import { EvacuationFileService } from '../evacuation-file.service';
import { EvacuationFileModel } from 'src/app/core/model/evacuation-file.model';
import * as globalConst from '../../../../core/services/globalConstants';

@Component({
  selector: 'app-evacuation-file-list',
  templateUrl: './evacuation-file-list.component.html',
  styleUrls: ['./evacuation-file-list.component.scss']
})
export class EvacuationFileListComponent implements OnInit {
  currentPath: string;
  primaryEssFile: EvacuationFileModel;
  showActiveList = true;
  showInactiveList = true;
  currentChild: EvacuationFileModel;
  dataSourceActive: Array<EvacuationFileModel>;
  dataSourceInactive: Array<EvacuationFileModel>;
  showLoading = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    public formCreationService: FormCreationService,
    private evacuationFileService: EvacuationFileService,
    private evacuationFileDataService: EvacuationFileDataService
  ) {}

  ngOnInit(): void {
    this.currentPath = window.location.pathname;

    if (this.currentPath === '/verified-registration/dashboard/current') {
      this.showLoading = true;
      this.evacuationFileService
        .getCurrentEvacuationFiles()
        .subscribe((files) => {
          this.dataSourceActive = files;
          this.dataSourceActive.sort(
            (a, b) =>
              new Date(b.evacuationFileDate).valueOf() -
              new Date(a.evacuationFileDate).valueOf()
          );
          this.evacuationFileDataService.setCurrentEvacuationFileCount(
            files.length
          );
          this.primaryEssFile = this.dataSourceActive[0];
          this.showLoading = false;
        });
    } else if (this.currentPath === '/verified-registration/dashboard/past') {
      this.showLoading = true;
      this.evacuationFileService.getPastEvacuationFiles().subscribe((files) => {
        this.dataSourceInactive = files;
        this.dataSourceInactive.sort(
          (a, b) =>
            new Date(b.evacuationFileDate).valueOf() -
            new Date(a.evacuationFileDate).valueOf()
        );
        console.log(this.dataSourceInactive);
        this.showLoading = false;
      });
    }
  }

  startAdditionalAssessment(): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: EssFileDialogComponent,
          essFileData: this.primaryEssFile,
          content: globalConst.addEssFile,
          initDialog: true
        },
        height: '270px',
        width: '700px'
      })
      .afterClosed()
      .subscribe((value) => {
        if (value === 'confirm') {
          this.formCreationService.clearNeedsAssessmentData();
          this.router.navigate(['/verified-registration/confirm-restriction']);
        }
      });
  }
}
