import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.getToken(),
    })
  };

  constructor(private baseService: BaseService, private authService: AuthService, private httpClient: HttpClient) { }

  getEvents(): Observable<any> {
    return this.httpClient.get<any>(this.baseService.baseUrl + '/event', this.httpOptions);
  }

  getActiveEvent(): Observable<any> {
    return this.httpClient.get<any>(this.baseService.baseUrl + '/event/active', this.httpOptions);
  }

  createOrEditEvent(eventCreateOrEditModel): Observable<any> {
    return this.httpClient.post<any>(this.baseService.baseUrl + '/event/', eventCreateOrEditModel, this.httpOptions);
  }

  deleteEvent(eventId): Observable<any> {
    return this.httpClient.delete<any>(this.baseService.baseUrl + '/event/' + eventId, this.httpOptions);
  }

  activateEvent(eventId): Observable<any> {
    return this.httpClient.patch<any>(this.baseService.baseUrl + '/event/' + eventId + '/activate', null, this.httpOptions);
  }
}
