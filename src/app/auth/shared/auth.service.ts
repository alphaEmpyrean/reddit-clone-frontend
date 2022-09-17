import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap, throwError } from 'rxjs';

import { SignupRequestPayload } from '../signup/signup-request.payload';
import { LoginRequestPayload } from '../login/login-request.payload';
import { LoginResponse } from '../login/login-response.payload';
import { LocalStorageService } from 'src/app/shared/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  refreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    username: this.getUserName()        
  }

  constructor(private httpClient: HttpClient,
    private localStorage: LocalStorageService) { }

  refreshToken() {
      return this.httpClient.post<LoginResponse>('http://localhost:8080/api/auth/refresh/token',
        this.refreshTokenPayload).pipe(
          tap(response => {
            this.localStorage.remove('authenticationToken');
            this.localStorage.remove('expiresAt');

            this.localStorage.set('authenticationToken', response.authenticationToken);
            this.localStorage.set('expiresAt', response.expiresAt.toString());
          })
        )
  }
  getUserName() {
    let storedName = this.localStorage.get('username');
    return storedName ? storedName : ''; 
  }
  getRefreshToken() {
    return this.localStorage.get('refreshToken');
  }
  getJwtToken() {
      return this.localStorage.get('authenticationToken');
  }

  signup(signupRequestPayload: SignupRequestPayload): Observable<any> {
    return this.httpClient.post('http://localhost:8080/api/auth/signup', signupRequestPayload, {responseType: 'text'});
  }

  login(loginRequestPayload: LoginRequestPayload): Observable<boolean> {
    return this.httpClient.post<LoginResponse>('http://localhost:8080/api/auth/login', loginRequestPayload)
      .pipe(map(data => {
        console.log(data.authenticationToken);
        this.localStorage.set('authenticationToken', data.authenticationToken);
        this.localStorage.set('username', data.username);
        this.localStorage.set('refreshToken', data.refreshToken);
        this.localStorage.set('expiresAt', data.expiresAt.toString());

        return true;
      }));
  }

  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }

  logout() {
    this.httpClient.post('http://localhost:8080/api/auth/logout', this.refreshTokenPayload,
      { responseType: 'text' })
      .subscribe({
        next: (data) => { console.log(data); },
        error: (error) => { throwError(() => new Error(error)); }        
      });
    this.localStorage.remove('authenticationToken');
    this.localStorage.remove('username');
    this.localStorage.remove('refreshToken');
    this.localStorage.remove('expiresAt');
  }
}
