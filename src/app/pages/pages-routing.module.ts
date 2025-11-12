import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayaoutComponent } from './layaout/layaout.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { JWT_OPTIONS } from '@auth0/angular-jwt';

import { MiCuentaComponent } from './mi-cuenta/mi-cuenta.component';
import { UpdatePassComponent } from './update-pass/update-pass.component';
import { CrearUsuariosComponent } from './usuarios/crear-usuarios/crear-usuarios.component';
import { ListaUsuariosComponent } from './usuarios/lista-usuarios/lista-usuarios.component';
import { EditUserComponent } from './usuarios/edit-user/edit-user.component';
import { ReporteComponent } from './Reportes/reporte/reporte.component';
import { InicioComponent } from './inicio/inicio.component';
import { ReporteFiltrosComponent } from './Reporte/reporte-filtros/reporte-filtros.component';
import { FormularioProveedoresClientesComponent } from './formulario-provedores-cliente/formulario-proveedores-clientes-creacion/formulario-proveedores-clientes.component';
import { ListRegistroTiempoComponent } from './RegistroTiempos/list-registro-tiempo/list-registro-tiempo.component';
import { ListaFormulariosComponent } from './formulario-provedores-cliente/lista-formularios/lista-formularios.component';
import { FormularioProovedoresClienteEdicionComponent } from './formulario-provedores-cliente/formulario-proovedores-cliente-edicion/formulario-proovedores-cliente-edicion.component';
import { ListaFormulariosClienteComponent } from './formulario-provedores-cliente/lista-formularios-cliente/lista-formularios-cliente.component';

const routes: Routes = [{
  path: 'dash',
  component: LayaoutComponent,
  children: [
    {
    path: 'Inicio',
    component: InicioComponent,//EditUserComponent
     },

     {
      path: 'ListaRegistros', //Redirección para compatibilidad
      redirectTo: 'ListaFormulariosUsuario',
      pathMatch: 'full'
       },
       {
        path: 'ListaFormulariosUsuario', //ListaFormulariosClienteComponent
        component: ListaFormulariosClienteComponent,
         },
       {
        path: 'CrearFormulario', //FormularioProovedoresClienteEdicionComponent
        component: FormularioProveedoresClientesComponent,
       },
       {
        path: 'ValidarFormulario', //FormularioProovedoresClienteEdicionComponent
        component: FormularioProovedoresClienteEdicionComponent,
       },



                  {
                  path: 'MiCuentaComponent', //CrearUsuariosComponent
                  component: MiCuentaComponent,
                   }, {
                    path: 'ActualizarPass',  //ReporteComponent
                    component: UpdatePassComponent,
                     }, {
                      path: 'CrearUsuarios',
                      component: CrearUsuariosComponent,
                       }
                       , {
                        path: 'ListaUsuarios',
                        component: ListaUsuariosComponent,
                         }
                         , {
                          path: 'EditarUsuario', //ReporteFiltrosComponent
                          component: EditUserComponent,
                           }
                           , {
                            path: 'Reporte',
                            component: ReporteComponent,
                             }
                             , {
                              path: 'ReporteFiltros',
                              component: ReporteFiltrosComponent,
                               }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  //providers:[  { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }]
})
export class PagesRoutingModule { }
