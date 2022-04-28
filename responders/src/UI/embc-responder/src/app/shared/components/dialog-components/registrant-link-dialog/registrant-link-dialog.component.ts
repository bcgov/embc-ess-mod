import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RegistrantProfileSearchResult } from 'src/app/core/api/models';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { MultipleLinkRegistrantModel } from 'src/app/core/models/multipleLinkRegistrant.model';

@Component({
  selector: 'app-registrant-link-dialog',
  templateUrl: './registrant-link-dialog.component.html',
  styleUrls: ['./registrant-link-dialog.component.scss']
})
export class RegistrantLinkDialogComponent implements OnInit {
  @Input() content: DialogContent;
  @Input() profileData: MultipleLinkRegistrantModel;
  @Output() outputEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  cancel() {
    this.outputEvent.emit('close');
  }

  linkProfile(selectedProfile: RegistrantProfileSearchResult) {
    this.outputEvent.emit(selectedProfile.id);
  }
}
