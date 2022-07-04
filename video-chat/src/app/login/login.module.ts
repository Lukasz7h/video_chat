import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';

import { LoginService } from './login.service';
import { RegisterService } from '../register/register.service';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    LoginService,
    RegisterService
  ]
})
export class LoginModule { }
