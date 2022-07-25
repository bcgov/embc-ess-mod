import { Component, OnInit } from '@angular/core';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';

@Component({
  selector: 'app-zero-file-result',
  templateUrl: './zero-file-result.component.html',
  styleUrls: ['./zero-file-result.component.scss']
})
export class ZeroFileResultComponent implements OnInit {
  constructor(public appBaseService: AppBaseService) {}

  ngOnInit(): void {}
}
