import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DetailedServiceResponseDto, DetailedServiceUpsertDto } from '../../models/admin.dto';



@Injectable({
  providedIn: 'root'
})
export class DetailedServicesAdminService {
  private baseUrl = environment.baseUrl + '/admin/detailed-services';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DetailedServiceResponseDto[]> {
    return this.http.get<DetailedServiceResponseDto[]>(this.baseUrl);
  }

  getById(id: number): Observable<DetailedServiceResponseDto> {
    return this.http.get<DetailedServiceResponseDto>(`${this.baseUrl}/${id}`);
  }

  create(payload: DetailedServiceUpsertDto): Observable<number> {
    return this.http.post<number>(this.baseUrl, payload);
  }

  update(id: number, payload: DetailedServiceUpsertDto): Observable<number> {
    return this.http.put<number>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }
}