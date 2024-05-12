import { Component, OnInit } from '@angular/core';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { SelectedPathType } from 'src/app/core/models/appBase.model';
import { EvacueeSearchService } from '../evacuee-search.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-zero-file-result',
    templateUrl: './zero-file-result.component.html',
    styleUrls: ['./zero-file-result.component.scss'],
    standalone: true,
    imports: [NgIf]
})
export class ZeroFileResultComponent implements OnInit {
  readonly selectedPathType = SelectedPathType;
  constructor(
    public evacueeSearchService: EvacueeSearchService,
    public optionInjectionService: OptionInjectionService
  ) {}

  ngOnInit(): void {}
}
