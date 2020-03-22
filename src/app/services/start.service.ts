import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { AuthService } from './auth.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StartService {

  constructor(private baseService: BaseService, private authService: AuthService, private httpClient: HttpClient) { }

  getDirections(startFormValue): Observable<any> {
    return this.httpClient.post<any>(this.baseService.baseUrl + '/app/navigate/' + startFormValue.start + '/' + startFormValue.end, null);
  }

  getKeywords(): Observable<any> {
    return this.httpClient.get<any>(this.baseService.baseUrl + '/app/keywords');
  }
}
