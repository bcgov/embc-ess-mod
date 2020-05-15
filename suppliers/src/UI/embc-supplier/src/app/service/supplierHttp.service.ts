import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SupplierHttpService {
  get headers(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  constructor(private http: HttpClient) {}

  getListOfCities() {
    this.http
      .get(`/api/Lists/communities`, { headers: this.headers })
      .subscribe((res) => {
        console.log(res);
      });
  }
}
