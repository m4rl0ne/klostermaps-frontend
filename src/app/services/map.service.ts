import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http';
import { ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  baseUrl = "http://127.0.0.1:5000/api"

  constructor(private http: HttpClient) { }

  getMap(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'map': 'Test123'
      }),
      responseType: 'blob' as 'json',
    };

    return this.http.get<any>(this.baseUrl + '/app/map', httpOptions);
  }
}
