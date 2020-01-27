import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  TOKEN_NAME = "jwt_token"

  constructor(private baseService: BaseService, private http: HttpClient, private router: Router) { }

  getToken(): string {
    return localStorage.getItem(this.TOKEN_NAME);
  }

  setToken(token:string): void {
    localStorage.setItem(this.TOKEN_NAME, token);
  }

  getTokenExpirationDate(token:string): Date {
    const decoded = jwt_decode(token);

    if(decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;

  }

  isTokenExpired(token?: string): boolean {
    if(! token) token = this.getToken();
    if(! token) return true;

    let date: Date = null;

    try {
      date = this.getTokenExpirationDate(token);
    }catch (e) {
      return false;
    }

    if(date == undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  login(cred: any): void | boolean {
    this.http.post<any>(this.baseService.baseUrl + '/login', cred).subscribe(res => {      

      this.setToken(res.token)
      this.router.navigate(['/admin/overview']);
    },
    err => {
      return false;
    });
  }

  isAuthenticated(): boolean {
    if (!this.isTokenExpired()) {
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_NAME);
    this.router.navigate(['/admin/login']);
  }
}
