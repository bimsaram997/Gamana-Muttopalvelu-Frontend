import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BookingResponse, BookingResponseDto, CreateBookingPayload } from '../models/dto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

 baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  createBooking(payload: CreateBookingPayload): Observable<BookingResponseDto> {
    return this.http.post<BookingResponseDto>(this.baseUrl + '/bookings', payload);
  }

  // Digitransit Address Search Helper
 
}
