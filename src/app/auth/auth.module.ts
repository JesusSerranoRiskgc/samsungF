import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { MensajeModalComponent } from './mensaje-modal/mensaje-modal.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { AuthService } from './authservices/auth.services';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RecuperarPasswordComponent } from './recuperar-password/recuperar-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { RegistrarseComponent } from './registrarse/registrarse.component';


@NgModule({
  declarations: [
    MensajeModalComponent,
    LoginComponent,
    RecuperarPasswordComponent,
    RegistrarseComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule ,
    ReactiveFormsModule  ,
    TranslateModule
  ],providers: [
    AuthGuard,
    AuthService,
    HttpClient,
    JwtHelperService  // Agrega AuthGuard   como un proveedor
  ]
})
export class AuthModule { }
