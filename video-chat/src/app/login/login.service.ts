import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ){}

  sendForm(formValue: {login: string, password: string}): Observable<Object>
  {
    return this.http.post("http://localhost:3000/login", JSON.stringify(formValue), {withCredentials: true});
  }
}