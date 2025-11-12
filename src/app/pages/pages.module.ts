import { NgModule,LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PagesRoutingModule } from './pages-routing.module';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { LayaoutComponent } from './layaout/layaout.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AuthService } from '../auth/authservices/auth.services';
import { NgbDateParserFormatter, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuItemComponent } from './layaout/menu-item.component';
import { JWT_OPTIONS, JwtHelperService, JwtInterceptor, JwtModule } from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AlertModalComponent } from './utils/alert-modal/alert-modal.component';
import { ServicioPrincipalService } from './Services/main.services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomDateParserFormatter } from './utils/FormatoFecha/custom-date-parser-formatter';
import { MiCuentaComponent } from './mi-cuenta/mi-cuenta.component';
import { ReporteComponent } from './Reportes/reporte/reporte.component';
import { UpdatePassComponent } from './update-pass/update-pass.component';
import { CrearUsuariosComponent } from './usuarios/crear-usuarios/crear-usuarios.component';
import { ListaUsuariosComponent } from './usuarios/lista-usuarios/lista-usuarios.component';
import { EditUserComponent } from './usuarios/edit-user/edit-user.component';
import { InicioComponent } from './inicio/inicio.component';

import { ConfirmDeleteModalComponent } from './utils/confirm-delete-modal/confirm-delete-modal.component';

import { ReporteFiltrosComponent } from './Reporte/reporte-filtros/reporte-filtros.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SidebarComponent } from './layaout/sidebar/sidebar.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es'; // o cualquier otra localización que prefieras
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormularioProveedoresClientesComponent } from './formulario-provedores-cliente/formulario-proveedores-clientes-creacion/formulario-proveedores-clientes.component';
import { ListRegistroTiempoComponent } from './RegistroTiempos/list-registro-tiempo/list-registro-tiempo.component';
import { RepresentanteLegalComponent } from './representante-legal/representante-legal.component';
import { JuntaDirectivaComponent } from './JuntaDirectiva/junta-directiva/junta-directiva.component';
import { DatosGeneralesComponent } from './DatosGenerales/datos-generales/datos-generales.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { DatosAdjuntosComponent } from './DatosAdjuntos/datos-adjuntos/datos-adjuntos.component';
import { DatosContactoComponent } from './DatosContacto/datos-contacto/datos-contacto.component';
import { FormularioProovedoresClienteEdicionComponent } from './formulario-provedores-cliente/formulario-proovedores-cliente-edicion/formulario-proovedores-cliente-edicion.component';
import { JuntaDirectivaEdicionComponent } from './JuntaDirectiva/junta-directiva-edicion/junta-directiva-edicion.component';
import { DatosAdjuntosEdicionComponent } from './DatosAdjuntos/datos-adjuntos-edicion/datos-adjuntos-edicion.component';
import { DatosDePagoComponent } from './DatosPago/datos-de-pago/datos-de-pago.component';
import { DespachoDeMercanciaComponent } from './DespachoDeMercancia/despacho-de-mercancia/despacho-de-mercancia.component';
import { CumplimientoNormativoComponent } from './CumplimientoNormativo/cumplimiento-normativo/cumplimiento-normativo.component';
import { AccionistasComponent } from './Accionistas/accionistas/accionistas.component';
import { BeneficiarioFinalComponent } from './BeneficiarioFinal/beneficiario-final/beneficiario-final.component';
import { ReferenciasComercialesBancariasComponent } from './ReferenciasComercialesBancarias/referencias-comerciales-bancarias/referencias-comerciales-bancarias.component';
import { ListaFormulariosComponent } from './formulario-provedores-cliente/lista-formularios/lista-formularios.component';
import { AlertaGuardadoSinValidacionComponent } from './utils/alerta-guardado-sin-validacion/alerta-guardado-sin-validacion.component';
import { FormularioPdfCompletoComponent } from './formulario-pdf-completo/formulario-pdf-completo.component';
import { RechazoModalComponent } from './utils/rechazo-modal/rechazo-modal.component';
import { ResultadoListasInspektorComponent } from './utils/resultado-listas-inspektor/resultado-listas-inspektor.component';
import { ListaFormulariosClienteComponent } from './formulario-provedores-cliente/lista-formularios-cliente/lista-formularios-cliente.component';
import { InformacionInternaOEAComponent } from './informacion-interna-oea/informacion-interna-oea.component';
import { DeclaracionesComponent } from './Declaraciones/declaraciones/declaraciones.component';
import { InformacionTributariaComponent } from './InformacionTributaria/informacion-tributaria/informacion-tributaria.component';
import { ConflictoInteresComponent } from './conflictoInteres/conflicto-intereses/conflicto-interes.component';
import { InformacionComplementariaComponent } from './InformacionComplementaria/informacion-complementaria/informacion-complementaria.component';
import { InformacionFinancieraComponent } from './InformacionFinanciera/informacion-financiera/informacion-financiera.component';
import { DatosRevisorFiscalComponent } from './DatosRevisorFiscal/datos-revisorfiscal/datos-revisorfiscal.component';

registerLocaleData(localeEs, 'es');
@NgModule({
  declarations: [
    DashBoardComponent,
    LayaoutComponent,
    MenuItemComponent,

    AlertModalComponent,

    MiCuentaComponent,
    ReporteComponent,
    UpdatePassComponent,
    CrearUsuariosComponent,
    ListaUsuariosComponent,
    EditUserComponent,
    InicioComponent,

    ConfirmDeleteModalComponent,
    ListRegistroTiempoComponent,
    ReporteFiltrosComponent,
    SidebarComponent,
    FormularioProveedoresClientesComponent,
    RepresentanteLegalComponent,
    JuntaDirectivaComponent,
    DatosGeneralesComponent,
    DatosAdjuntosComponent,
    DatosContactoComponent,
    FormularioProovedoresClienteEdicionComponent,
    JuntaDirectivaEdicionComponent,
    DatosAdjuntosEdicionComponent,
    DatosDePagoComponent,
    DespachoDeMercanciaComponent,
    CumplimientoNormativoComponent,
    AccionistasComponent,
    BeneficiarioFinalComponent,
    ReferenciasComercialesBancariasComponent,
    ListaFormulariosComponent,
    AlertaGuardadoSinValidacionComponent,
    FormularioPdfCompletoComponent,
    RechazoModalComponent,
    ResultadoListasInspektorComponent,
    ListaFormulariosClienteComponent,
    InformacionInternaOEAComponent,
    DeclaracionesComponent,
    InformacionTributariaComponent,
    ConflictoInteresComponent,
    InformacionComplementariaComponent,
    InformacionFinancieraComponent,
    DatosRevisorFiscalComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    NgxChartsModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    ReactiveFormsModule,
    NgbPaginationModule ,
    NgxFileDropModule
  ],exports: [
    LayaoutComponent,
    DashBoardComponent,
    BeneficiarioFinalComponent,
    FormularioProovedoresClienteEdicionComponent

  ],

  providers:[
    AuthService,
    ServicioPrincipalService,
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    // { provide: LOCALE_ID, useValue: 'es-CO' } ,
    { provide: NgbDatepickerConfig, useValue: { locale: 'es-CO' } }

  ]
})
export class PagesModule { }
