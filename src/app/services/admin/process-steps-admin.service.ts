import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProcessStepResponseDto, ProcessStepUpsertDto } from '../../models/admin.dto';


@Injectable({
  providedIn: 'root'
})
export class ProcessStepsAdminService {
  private baseUrl = environment.baseUrl + '/admin/process-steps';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProcessStepResponseDto[]> {
    return this.http.get<ProcessStepResponseDto[]>(this.baseUrl);
  }

  getById(id: number): Observable<ProcessStepResponseDto> {
    return this.http.get<ProcessStepResponseDto>(`${this.baseUrl}/${id}`);
  }

  create(payload: ProcessStepUpsertDto): Observable<number> {
    return this.http.post<number>(this.baseUrl, payload);
  }

  update(id: number, payload: ProcessStepUpsertDto): Observable<number> {
    return this.http.put<number>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }
}