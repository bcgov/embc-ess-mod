import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { EvacuationFileStatus } from 'src/app/core/api/models';
import { EvacuationFileModel } from 'src/app/core/model/evacuation-file.model';
import { EvacuationFileMappingService } from '../evacuation-file-mapping.service';

@Component({
  selector: 'app-evacuation-card',
  templateUrl: './evacuation-card.component.html',
  styleUrls: ['./evacuation-card.component.scss']
})
export class EvacuationCardComponent implements OnInit {
  @Input() evacuationFileCard: EvacuationFileModel;

  imageIcon: string;
  pathName: string;

  constructor(
    private router: Router,
    private evacuationFileMapping: EvacuationFileMappingService
  ) {
    this.pathName = window.location.pathname;
  }

  ngOnInit(): void {
    this.changeStatusColor();
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
      this.router.navigate([
        '/verified-registration/dashboard/current/' +
          this.evacuationFileCard.fileId
      ]);
    } else {
      this.router.navigate([
        '/verified-registration/dashboard/past/' +
          this.evacuationFileCard.fileId
      ]);
    }
  }
}
