import { Injectable } from '@angular/core';
import { environment } from '../../environment.development';
import { BookingResponse, CreateBookingPayload } from '../models/dto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

 baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  createBooking(payload: CreateBookingPayload): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(this.baseUrl + '/bookings', payload);
  }

  // Digitransit Address Search Helper
 
}
