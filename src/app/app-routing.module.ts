import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { JWT_OPTIONS } from '@auth0/angular-jwt';


const routes: Routes = [  {
  path: 'pages',
  canActivate: [AuthGuard],
  loadChildren: () => import('./pages/pages.module')
    .then(m => m.PagesModule),
},
{
  path: 'auth',
  loadChildren: () => import('./auth/auth.module')
    .then(m => m.AuthModule),
},
{ path: '', redirectTo: 'pages/dash/ListaFormulariosUsuario', pathMatch: 'full' },
{ path: '**', redirectTo: 'pages/dash/ListaFormulariosUsuario' },];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  //providers:[  { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }]
})
export class AppRoutingModule { }
