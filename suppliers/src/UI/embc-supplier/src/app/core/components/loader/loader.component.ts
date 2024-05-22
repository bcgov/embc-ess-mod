import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    standalone: true,
    imports: [NgIf]
})
export class LoaderComponent {
  @Input() showLoader: boolean;
}
