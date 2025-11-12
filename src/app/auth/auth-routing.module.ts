import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RecuperarPasswordComponent } from './recuperar-password/recuperar-password.component';
import { RegistrarseComponent } from './registrarse/registrarse.component';

const routes: Routes =  [{
  path: 'login',//RecuperarPasswordComponent
  component: LoginComponent,
},{
  path: 'RecuperarCuenta',//RecuperarPasswordComponent
  component: RecuperarPasswordComponent,
}
,{
  path: 'registrarse',//RecuperarPasswordComponent
  component: RegistrarseComponent,
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
