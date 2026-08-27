import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateOfferPayload, OfferResponseDto } from '../models/dto';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OfferService {

  baseUrl = environment.baseUrl;
  
    constructor(private http: HttpClient) {}
  
    createOffer(payload: CreateOfferPayload): Observable<OfferResponseDto> {
      return this.http.post<OfferResponseDto>(this.baseUrl + '/offer', payload);
    }
}
