import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersResponse } from '../lobby/lobby.component';
import { UserResponse } from '../details/details.component';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  baseUrl = 'https://gorest.co.in/public-api/';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.baseUrl}users`);
  }

  getUser(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}users/${id}`);
  }

  getNextUsers(pageNo: number = 1): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.baseUrl}users`, {
      params: { page: pageNo },
    });
  }
}
