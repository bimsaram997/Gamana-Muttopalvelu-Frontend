import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressLookupService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  searchAddress(query: string): Observable<any> {
  const url = `${this.baseUrl}/Address/lookup?query=${encodeURIComponent(query)}`;
  return this.http.get<any>(url);
}
}
