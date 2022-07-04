import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { RegisterService } from './register.service';
import { errors } from './registerErrors';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent
{
  constructor(
    private registerService: RegisterService
  ){}

  @ViewChild("errors")
  errorsElement: ElementRef | undefined;

  // sprawdzamy zawartość formularza rejestracji użytkownika (czy można go wysłać)
  validForm(form: NgForm)
  {
    this.registerService.validForm(form.value)?
    this.sendForm(form.value):
    errors.err_len(
      this.errorsElement? this.errorsElement.nativeElement as HTMLElement: document.getElementsByName("div").item(0),
      this.registerService.validSettings
    );
  }

  // wysyłamy formularz rejestracji który uzupełnił użytkownik
  sendForm(formValue: {login: string, password: string})
  {
    if(this.errorsElement) this.errorsElement.nativeElement.innerHTML = "";
    this.registerService.sendForm(formValue).subscribe( (data: any) => {
      if(!data.registerWell) errors.err_isset(this.errorsElement? this.errorsElement.nativeElement as HTMLElement: document.getElementsByName("div").item(0));
    });
  }
}