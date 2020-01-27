import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http';
import { ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { Map } from '../interfaces/Map.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private baseService: BaseService, private authService: AuthService, private http: HttpClient) { }

  getAllMaps(): Observable<Map[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.authService.getToken(),
        'withimage': 'false'
      })
    };

    return this.http.get<Map[]>(this.baseService.baseUrl + '/map', httpOptions)
  }

  getMap(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'map': 'Test123'
      }),
      responseType: 'blob' as 'json',
    };

    return this.http.get<any>(this.baseService.baseUrl + '/app/map', httpOptions);
  }
}
