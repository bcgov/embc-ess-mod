import { Component, OnInit } from '@angular/core';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';

@Component({
  selector: 'app-search-wrapper',
  templateUrl: './search-wrapper.component.html',
  styleUrls: ['./search-wrapper.component.scss']
})
export class SearchWrapperComponent implements OnInit {
  loadedComponent: any;
  constructor(private optionInjectionService: OptionInjectionService) {}

  ngOnInit(): void {
    this.optionInjectionService?.instance?.loadDefaultComponent();
  }
}
