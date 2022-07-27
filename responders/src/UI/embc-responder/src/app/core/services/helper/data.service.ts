import { Injectable } from '@angular/core';
import { SearchDataService } from './search-data.service';

@Injectable({
  providedIn: 'root'
})
export class DataService extends SearchDataService {}
