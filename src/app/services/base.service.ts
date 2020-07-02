import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  // public baseUrl = "https://klostermaps.herokuapp.com/api"
  public baseUrl = "http://192.168.178.176:5000/api"

  constructor() { }
}
