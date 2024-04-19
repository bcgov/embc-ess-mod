import { Component, Input, OnInit } from '@angular/core';
import { EnvironmentInformation } from '../../model/environment-information.model';
import { MarkdownComponent } from 'ngx-markdown';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-environment-banner',
  templateUrl: './environment-banner.component.html',
  styleUrls: ['./environment-banner.component.scss'],
  standalone: true,
  imports: [NgStyle, MarkdownComponent]
})
export class EnvironmentBannerComponent {
  @Input() environment?: EnvironmentInformation;

  constructor() {}
}
