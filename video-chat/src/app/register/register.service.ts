import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private http: HttpClient
  ) { }

  // objekt zawiera informacje o tym jak długi powinien być login i hasło oraz sprawdza czy faktycznie taki jest
  validSettings = {

    login: {
      minLen: 4,
      maxLen: 22,
      validLogin: (loginValue: string): boolean => loginValue.length >= this.validSettings.login.minLen && loginValue.length <= this.validSettings.login.maxLen
    },

    password: {
      minLen: 6,
      maxLen: 30,
      validPass: (passValue: string): boolean => passValue.length >= this.validSettings.password.minLen && passValue.length <= this.validSettings.password.maxLen
    }
  }


  validForm(formValue: {login: string, password: string}): boolean
  {
    return this.validSettings.login.validLogin(formValue.login) && this.validSettings.password.validPass(formValue.password);
  }

  sendForm(formValue: {login: string, password: string}): Observable<Object>
  {
    return this.http.post("http://localhost:3000/register", JSON.stringify(formValue));
  }
}