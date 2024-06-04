import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { EvacuationFileStatus } from 'src/app/core/api/models';
import { EvacuationFileModel } from 'src/app/core/model/evacuation-file.model';
import { EvacuationFileMappingService } from '../evacuation-file-mapping.service';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import * as moment from 'moment';
import { EvacuationFileDataService } from '../evacuation-file-data.service';

@Component({
  selector: 'app-evacuation-card',
  templateUrl: './evacuation-card.component.html',
  styleUrls: ['./evacuation-card.component.scss'],
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatButtonModule, DatePipe]
})
export class EvacuationCardComponent implements OnInit {
  EvacuationFileStatus = EvacuationFileStatus;
  @Input() evacuationFileCard: EvacuationFileModel;

  imageIcon: string;
  pathName: string;

  hasActiveSupports: boolean = false;
  hasNoSupports: boolean = false;
  canExtendSupports: boolean = false;

  constructor(
    private router: Router,
    private evacuationFileMapping: EvacuationFileMappingService,
    private evacuationFileDataService: EvacuationFileDataService
  ) {
    this.pathName = window.location.pathname;
  }

  ngOnInit(): void {
    this.changeStatusColor();

    this.hasActiveSupports = this.evacuationFileDataService.hasActiveSupports(this.evacuationFileCard.supports);

    this.hasNoSupports = this.evacuationFileDataService.hasNoSupports(this.evacuationFileCard.supports);

    this.canExtendSupports = this.evacuationFileCard?.selfServeEnabled ?? false;
  }

  changeStatusColor(): void {
    switch (this.evacuationFileCard.status) {
      case EvacuationFileStatus.Active:
        this.imageIcon = '/assets/images/status-blue.svg';
        break;
      case EvacuationFileStatus.Completed:
        this.imageIcon = '/assets/images/status-green.svg';
        break;
      case EvacuationFileStatus.Expired:
        this.imageIcon = '/assets/images/status-grey.svg';
        break;
      case EvacuationFileStatus.Pending:
        this.imageIcon = '/assets/images/status-orange.svg';
        break;
      case EvacuationFileStatus.Archived:
        this.imageIcon = '/assets/images/status-black.svg';
        break;
    }
  }

  goToDetails(): void {
    this.evacuationFileMapping.mapEvacuationFile(this.evacuationFileCard);

    if (this.pathName === '/verified-registration/dashboard/current') {
      this.router.navigate(['/verified-registration/dashboard/current/' + this.evacuationFileCard.fileId]);
    } else {
      this.router.navigate(['/verified-registration/dashboard/past/' + this.evacuationFileCard.fileId]);
    }
  }
}
