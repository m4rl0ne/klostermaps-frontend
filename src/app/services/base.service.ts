import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  public baseUrl = "http://127.0.0.1:5000/api"

  constructor() { }
}
