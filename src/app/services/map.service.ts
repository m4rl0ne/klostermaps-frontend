import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { Map } from '../interfaces/Map.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.getToken(),
    })
  };

  constructor(private baseService: BaseService, private authService: AuthService, private httpClient: HttpClient) { }

  getAllMaps(): Observable<Map[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.authService.getToken(),
        'withimage': 'false'
      })
    };

    return this.httpClient.get<Map[]>(this.baseService.baseUrl + '/map', httpOptions)
  }

  getMap(name): Observable<Blob> {

    return this.httpClient.get(this.baseService.baseUrl + '/app/map/' + name, {responseType: 'blob'});
  }

  uploadMap(files): Observable<any> {
    let formData = new FormData();
    formData.append('mapImage', files[0], files[0].name);

    return this.httpClient.post<any>(this.baseService.baseUrl + '/map/upload', formData, this.httpOptions);
  }

  nameExists(name: string): Observable<any> {
    return this.httpClient.post<any>(this.baseService.baseUrl + '/map/name/' + encodeURIComponent(name) + '/exists', null, this.httpOptions);
  }

  createOrEditMap(mapCreateOrEditModel: any): Observable<any> {
    return this.httpClient.post<any>(this.baseService.baseUrl + '/map/', mapCreateOrEditModel, this.httpOptions);
  }

  deleteMap(mapId: number): Observable<any> {
    return this.httpClient.delete<any>(this.baseService.baseUrl + '/map/' + mapId, this.httpOptions);
  }
}
