import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormOptionResponseDto, FormOptionUpsertDto } from '../../models/admin.dto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FormOptionService {

   private baseUrl = environment.baseUrl + '/admin/key-services';
  
    constructor(private http: HttpClient) {}
  
    getAll(): Observable<FormOptionResponseDto[]> {
      return this.http.get<FormOptionResponseDto[]>(this.baseUrl);
    }
  
    getById(id: number): Observable<FormOptionResponseDto> {
      return this.http.get<FormOptionResponseDto>(`${this.baseUrl}/${id}`);
    }
  
    create(payload: FormOptionUpsertDto): Observable<number> {
      return this.http.post<number>(this.baseUrl, payload);
    }
  
    update(id: number, payload: FormOptionUpsertDto): Observable<number> {
      return this.http.put<number>(`${this.baseUrl}/${id}`, payload);
    }
  
    delete(id: number): Observable<boolean> {
      return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
    }
  
}
