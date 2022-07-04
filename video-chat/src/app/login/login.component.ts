import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Router } from '@angular/router';
import { RegisterService } from '../register/register.service';

import { LoginService } from './login.service';
import { showError } from './loginErrors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent
{

  @ViewChild("errors")
  errorsElement: ElementRef | undefined;

  constructor(
    private loginService: LoginService,
    private registerService: RegisterService,
    private route: Router
  ){}

  // sprawdzamy formularz logowania i wysyłamy go
  validLoginForm(form: NgForm)
  {
    !this.registerService.validForm(form.value)?
    showError(this.errorsElement?.nativeElement):
    this.loginService.sendForm(form.value)
    .subscribe((e: {login: boolean} | {err: string} | any) => {
      !e.login?
      showError(this.errorsElement?.nativeElement): window.location.href = "http://localhost:3001/"
    });
  }
}