import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { VersionInformation } from 'src/app/core/api/models/version-information';

@Component({
  selector: 'app-app-version-dialog',
  templateUrl: './app-version-dialog.component.html',
  styleUrls: ['./app-version-dialog.component.scss']
})
export class AppVersionDialogComponent implements OnInit {
  @Input() versionArray?: Array<VersionInformation>;
  @Output() outputEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {
    console.log(this.versionArray);
  }

  close(): void {
    this.outputEvent.emit('close');
  }
}
