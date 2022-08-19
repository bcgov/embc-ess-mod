import { Injectable } from '@angular/core';
import { MockSearchDataService } from './mockSearchData.service';

@Injectable({
  providedIn: 'root'
})
export class MockDataService extends MockSearchDataService {}
