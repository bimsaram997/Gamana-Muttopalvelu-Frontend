import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReviewResponseDto, ReviewUpsertDto } from '../../models/admin.dto';


@Injectable({
  providedIn: 'root'
})
export class ReviewAdminService {
  private baseUrl = environment.baseUrl + '/admin/reviews';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ReviewResponseDto[]> {
    return this.http.get<ReviewResponseDto[]>(this.baseUrl);
  }

  getById(id: number): Observable<ReviewResponseDto> {
    return this.http.get<ReviewResponseDto>(`${this.baseUrl}/${id}`);
  }

  create(payload: ReviewUpsertDto): Observable<number> {
    return this.http.post<number>(this.baseUrl, payload);
  }

  update(id: number, payload: ReviewUpsertDto): Observable<number> {
    return this.http.put<number>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }
}