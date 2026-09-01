import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SimpleServiceResponseDto, SimpleServiceUpsertDto } from '../../models/admin.dto';



@Injectable({
  providedIn: 'root'
})
export class KeyServicesAdminService {
  private baseUrl = environment.baseUrl + '/admin/key-services';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SimpleServiceResponseDto[]> {
    return this.http.get<SimpleServiceResponseDto[]>(this.baseUrl);
  }

  getById(id: number): Observable<SimpleServiceResponseDto> {
    return this.http.get<SimpleServiceResponseDto>(`${this.baseUrl}/${id}`);
  }

  create(payload: SimpleServiceUpsertDto): Observable<number> {
    return this.http.post<number>(this.baseUrl, payload);
  }

  update(id: number, payload: SimpleServiceUpsertDto): Observable<number> {
    return this.http.put<number>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }
}