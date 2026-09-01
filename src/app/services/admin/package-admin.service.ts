import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PackageResponseDto, PackageUpsertDto } from '../../models/admin.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackageAdminService {

  private baseUrl = environment.baseUrl + '/admin/packages';

  constructor(private http: HttpClient) {}

  getAll(): Observable<PackageResponseDto[]> {
    return this.http.get<PackageResponseDto[]>(this.baseUrl);
  }

  getById(id: number): Observable<PackageResponseDto> {
    return this.http.get<PackageResponseDto>(`${this.baseUrl}/${id}`);
  }

  create(payload: PackageUpsertDto): Observable<number> {
    return this.http.post<number>(this.baseUrl, payload);
  }

  update(id: number, payload: PackageUpsertDto): Observable<number> {
    return this.http.put<number>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }
}
