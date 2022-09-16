import { Component, OnInit } from '@angular/core';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { SelectedPathType } from 'src/app/core/models/appBase.model';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';

@Component({
  selector: 'app-zero-file-result',
  templateUrl: './zero-file-result.component.html',
  styleUrls: ['./zero-file-result.component.scss']
})
export class ZeroFileResultComponent implements OnInit {
  readonly selectedPathType = SelectedPathType;
  constructor(
    public appBaseService: AppBaseService,
    public optionInjectionService: OptionInjectionService
  ) {}

  ngOnInit(): void {}
}
