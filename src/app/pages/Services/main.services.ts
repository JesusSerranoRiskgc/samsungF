import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../enviroments/environment.prod';
import { Cliente } from '../Models/ClienteModelDto';
import { Area } from '../Models/AreaModelDto';
import { Servicio } from '../Models/ServiciosModelDto';
import { Actividad } from '../Models/ActividadModelDto';
import { RegistroActividades } from '../Models/RegistroActividadDto';
import { DatosGeneralesDto } from '../Models/DatosGeneralesDto';
import { SSF } from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ServicioPrincipalService {

  private tokenKey = 'auth_token';
  private apiUrl =`${environment.apiUrl}/`;
  private readonly apiClintelist: string = 'Cliente/listaClientes';
  private readonly apiCurrenUser: string = 'auth/current';
  private readonly Apichangepassword: string = 'auth/passwordchange';

  private readonly apilistEstados: string = 'ListasSeleccion/listaEstadosForm';
  private readonly apilistUsuariosclientes: string = 'ListasSeleccion/listaUsuariosclienteproveedor';


  private readonly apilistTipoSolicitud: string = 'ListasSeleccion/listaTipoSolicitud';
  private readonly apilistlClaseTercero: string = 'ListasSeleccion/listaClaseTercero';
  private readonly apilistCategoriaTerceros: string = 'ListasSeleccion/listaCategoriaTercero';
  private readonly apilistPaises: string = 'ListasSeleccion/listaPaises';
  private readonly apilistTamañoTercero: string = 'ListasSeleccion/listaTamañoTercero';
  private readonly apilistActividadesEconomicas: string = 'ListasSeleccion/listaActividadEconomica';
  private readonly apilistsino: string = 'ListasSeleccion/listaSiNO';

  private readonly apilistTipoDocumentos: string = 'ListasSeleccion/listaTiposDocumentos';

  private readonly apilistTipoCuentaBanc: string = 'ListasSeleccion/listaTipoCuentaBancaria';


  private readonly apilistTipoReferencia: string = 'ListasSeleccion/listaTipoReferenciaBanCom';

  private readonly apilistFormularios: string = 'RegistroFormulario/ListaFormularios';

  private readonly apilistResultadosInspektor: string = 'RegistroFormulario/ConsultaResultadosListas';

  private readonly ApiSolicitudNuevoFormulario: string = 'RegistroFormulario/SolicitudNuevoFormulario';

  private readonly ApiSolicitudCopiarFormulario: string = 'RegistroFormulario/ReplicaFormulario';

  private readonly ApiEstadoCambio: string = 'RegistroFormulario/CambiaEstadoFormulario';


  private readonly ApiAceptaFormulario: string = 'RegistroFormulario/ApruebaFormulario';


  private readonly apiCompradorVendedor: string = 'ListasSeleccion/listaEmpleados';
  private readonly apiUsuarioslist: string = 'auth/listaUsuariosAPP';

  private readonly apiEliminaArchivoCargado: string = 'RegistroFormulario/EliminaArchivoCargado';
  private readonly apiMotivoRechazo: string = 'RegistroFormulario/ConsultaMotivoRechazo';
  private readonly apiArchivosSubidos: string = 'RegistroFormulario/ListaArchivosCargadosxFormualrio';
  private readonly apidESCARGARARCHIVO: string = 'RegistroFormulario/descargararchivo';

  private readonly apiDescargaInfoInkspektor: string = 'RegistroFormulario/descargaReporteInspektor';

  private readonly ApiDatosGeneralesSave: string = 'RegistroFormulario/GuardaDatosGenerales';

  private readonly ApiDatosContactosSave: string = 'RegistroFormulario/GuardaDatosContacto';

  private readonly ApiReferenciasSave: string = 'RegistroFormulario/GuardaReferenciasComerciales';

  private readonly ApiDatoPagoSave: string = 'RegistroFormulario/GuardaDatosPago';

  private readonly ApiCumplimientoNormSave: string = 'RegistroFormulario/GuardaCumplimientoNormativo';

  private readonly ApiGuardarConflictoIntereses: string = 'RegistroFormulario/GuardaConflictoInteres';

  private readonly ApGuardaInformacionComplementaria: string = 'RegistroFormulario/GuardaInformacionComplementaria';

  private readonly ApiGuardaInformacionFinanciera: string = 'RegistroFormulario/GuardaInformacionFinanciera';

  private readonly ApiGuardaDatosRevisorFiscal: string = 'RegistroFormulario/GuardaDatosRevisorFiscal';

  private readonly ApiCalcularRiesgo: string = 'RegistroFormulario/CalcularRiesgo';

  private readonly ApiConsultarRiesgo: string = 'RegistroFormulario/ConsultarRiesgo';

  private readonly ApiGuardaInFoTribu: string = 'RegistroFormulario/GuardaInformacionTributaria';


  private readonly ApiDeclaracionesSave: string = 'RegistroFormulario/GuardaDeclaracionesFormulario';

  private readonly ApiDespachoMercanciaSave: string = 'RegistroFormulario/GuardaDespachoMercancia';

  private readonly ApiRepresentantesave: string = 'RegistroFormulario/GuardaInfoRepresentantesLegales';

  private readonly ApiAccionistassave: string = 'RegistroFormulario/GuardaInfoAccionistas';

  private readonly ApiJuntaDirectivasave: string = 'RegistroFormulario/GuardaInfoJuntaDirectiva';

  private readonly ApiSubirRCHIVOS: string = 'RegistroFormulario/uploadfiles';

  private readonly apiConsultaDatosGenerales: string = 'RegistroFormulario/ConsultaDatosGenerales';

  private readonly apiConsultaInformacionTributaria: string = 'RegistroFormulario/ConsultaInformacionTriburaria';


  private readonly apiConsultaInfoOEA: string = 'RegistroFormulario/ConsultaInformacionOEA';

  private readonly apiConsultaDatosContacto: string = 'RegistroFormulario/ConsultaDatosContactos';

  private readonly apiConsultaReferencais: string = 'RegistroFormulario/ConsultaReferenciasFinancieras';

  private readonly apiConsultaDatosPgo: string = 'RegistroFormulario/ConsultaDatosPago';

private readonly apiRepresentantelegal: string = 'RegistroFormulario/ConsultaRepresentanteLegal'

private readonly apiconsultaAccionistas: string = 'RegistroFormulario/ConsultaAccionistas'

private readonly apiconsultaJuntaDirectiva: string = 'RegistroFormulario/Consultajuntadirectiva'

  private readonly apiConsultaDespachoMercancia: string = 'RegistroFormulario/ConsultaDespachoMercancia';

  private readonly apiConsultaCumplimiento: string = 'RegistroFormulario/ConsultaCumplimientoNormativo';

  private readonly ApiConsultaConflictoIntereses: string = 'RegistroFormulario/ConsultaConflictoInteres';

  private readonly ApiConsultaInformacionComplementaria: string = 'RegistroFormulario/ConsultaInformacionComplementaria';

  private readonly ApiConsultaInformacionFinanciera: string = 'RegistroFormulario/ConsultaInformacionFinanciera';

  private readonly ApiConsultaDatosRevisorFiscal: string = 'RegistroFormulario/ConsultaDatosRevisorFiscal';

  private readonly apiConsultaDeclaraciones: string = 'RegistroFormulario/ConsultaDeclaraciones';


  private readonly apiUploadArchivosolo: string = 'RegistroFormulario/upload2';

  private readonly Apicreatenewuser: string = 'auth/addnewuser';
  private readonly ApiRechazarFomulario: string = 'RegistroFormulario/GuardaMotivoRechazo';
  private readonly ApiGuardaInfoOEA: string = 'RegistroFormulario/GuardaInformacionOEA';
  private readonly Apiedituser: string = 'auth/edituser';
  private readonly ApiUpdatepassword: string = 'auth/passwordUpdate';
  //url reporte

  private readonly ApiRpteArea :string = 'Reporte/reportehorastrabajadasarea';
  private readonly ApiRpteUsuario: string = 'Reporte/ReporteRegistroTiemposxUsuario';
  private readonly ApiRpreCliente: string = 'Reporte/ReporteRegistroTiemposxCliente';
  private readonly apiReporteServicio: string = 'Reporte/ReporteRegistroTiemposxServicio';

  private readonly apiReporteServicioFiltros: string = 'ReporteForm/GenerateExcel';


  private readonly ApiProcuraduria: string = 'RegistroFormulario/ConsultaInfoProcuraduria';
  private readonly ApiRamaJudicial: string = 'RegistroFormulario/ConsultaInfoRamaJudicial';
  private readonly ApiEjecucionPneas: string = 'RegistroFormulario/ConsultaInfoEjecucionPenas';



  private headers: any;
  private token: any;
  constructor(private http: HttpClient) {

    this.token= this.gettoken();
    this.headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        })
      };

  }

  gettoken(): string | null {
    const tokenString = localStorage.getItem(this.tokenKey);
  if (!tokenString) {
    return null;  // No hay token almacenado
  }
  try {
    const localestorage = JSON.parse(tokenString);
    const token = localestorage.token.access_token;
    return token;
  } catch (e) {
    console.error('Error parsing token from localStorage', e);
    return null;
  }
}

CurrentUser(): Observable<any>{
  return this.http.get<any>(`${this.apiUrl}${this.apiCurrenUser}`,this.headers);
}

changepassword(data:any): Observable<any>{
  return  this.http.post(`${this.apiUrl}${this.Apichangepassword}`, data, this.headers);
}

ListTipoSolicitud(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistTipoSolicitud}?Lang=${Lang}`,this.headers);
}


ListEstadosform(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistEstados}`,this.headers);
}

ListUsuarios(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistUsuariosclientes}`,this.headers);
}



MotivoRechazoservice(IdFormualio:number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apiMotivoRechazo}?IdFormulario=${IdFormualio}`,this.headers);
}

ListClaseTercero(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistlClaseTercero}?Lang=${Lang}`,this.headers);
}

ListCategoriaTercero(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistCategoriaTerceros}?Lang=${Lang}`,this.headers);
}

ListPaises(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistPaises}?Lang=${Lang}`,this.headers);
}

ListTamañoTercero(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistTamañoTercero}?Lang=${Lang}`,this.headers);
}

ListActividadEconomica(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistActividadesEconomicas}?Lang=${Lang}`,this.headers);
}

ListaSINO(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistsino}?Lang=${Lang}`,this.headers);
}

ListaTiposDocumentos(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistTipoDocumentos}?Lang=${Lang}`,this.headers);
}

ListaTiposCuentaBancaria(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistTipoCuentaBanc}?Lang=${Lang}`,this.headers);
}
ListaTipoReferencia(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistTipoReferencia}?Lang=${Lang}`,this.headers);
}

getFormularioslist(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistFormularios}?Lang=${Lang}`,this.headers);
}


getResultadosInspektorlist(IdFormualio:number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistResultadosInspektor}?IdFormulario=${IdFormualio}`,this.headers);
}

CrearNuevoFormulario(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.ApiSolicitudNuevoFormulario}`,this.headers);
}

CopiarFormualrio(IdFormualio:number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.ApiSolicitudCopiarFormulario}?IdFormulario=${IdFormualio}`,this.headers);
}




GuardarDatosGnerales(objRegistro:DatosGeneralesDto): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiDatosGeneralesSave}`, objRegistro,this.headers);
}

GuardarInformacionTriburaria(objRegistro:any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiGuardaInFoTribu}`, objRegistro,this.headers);
}




guardarContactos(contactos: any[]): Observable<any> {

  return this.http.post<any>(`${this.apiUrl}${this.ApiDatosContactosSave}`, contactos,this.headers);
}

guardarReferencias(referencias: any[]): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiReferenciasSave}`, referencias,this.headers);
}

GuardarDatoPgado(datopago: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiDatoPagoSave}`, datopago,this.headers);
}

GuardarCumplimientoNor(cumplimientoNorm: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiCumplimientoNormSave}`, cumplimientoNorm,this.headers);
}

GuardarConflictoIntereses(conflictoIntereses: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiGuardarConflictoIntereses}`, conflictoIntereses, this.headers );
}

GuardarInformacionComplementaria(informacionComplementaria: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApGuardaInformacionComplementaria}`, informacionComplementaria, this.headers );
}

GuardaInformacionFinanciera(informacionFinanciera: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiGuardaInformacionFinanciera}`, informacionFinanciera, this.headers );
}

GuardaDatosRevisorFiscal(datosRevisorFiscal: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiGuardaDatosRevisorFiscal}`, datosRevisorFiscal, this.headers );
}

CalcularRiesgoFormulario(IdFormulario: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.ApiCalcularRiesgo}?IdFormulario=${IdFormulario}`, this.headers);
}

ObtenerRiesgoFormulario(IdFormulario: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.ApiConsultarRiesgo}?IdFormulario=${IdFormulario}`, this.headers);
}

GuardarDeclaraciones(declaracion: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiDeclaracionesSave}`, declaracion,this.headers);
}


GuardarDespachoMercancia(despacho: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiDespachoMercanciaSave}`, despacho,this.headers);
}

guardarRepresentantesLegales(IdFormulario:number,representantes: any[]): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiRepresentantesave}/${IdFormulario}`, representantes,this.headers);
}


guardarAccionistas(IdFormulario:number,accionistas: any[]): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiAccionistassave}/${IdFormulario}`, accionistas,this.headers);
}

guardarJuntaDirectiva(IdFormulario:number,juntadirectiva: any[]): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiJuntaDirectivasave}/${IdFormulario}`, juntadirectiva,this.headers);
}



CambiarEstado(IdFormualrio:number,IdEstado:Number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.ApiEstadoCambio}?IdFormulario=${IdFormualrio}&IdEstado=${IdEstado}`,this.headers);
}



AceptaFormualio(IdFormualrio:number,IdEstado:Number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.ApiAceptaFormulario}?IdFormulario=${IdFormualrio}&IdEstado=${IdEstado}`,this.headers);
}


uploadFiles(idFormulario: string, files: { [key: string]: File }): Observable<any> {
  const formData = new FormData();
  formData.append('IdFormulario', idFormulario);

  // Agrega cada archivo al FormData con su clave
  for (const key in files) {
    if (files.hasOwnProperty(key)) {
      formData.append(key, files[key]);
    }
  }

  return this.http.post(this.ApiSubirRCHIVOS, formData);
}

enviarAdjuntos(formData: FormData) {
  return this.http.post(`${this.apiUrl}${this.ApiSubirRCHIVOS}`, formData);
}



//Reportes

getReporteArea(): Observable<any>{
  return this.http.get<any>(`${this.apiUrl}${this.ApiRpteArea}`,this.headers);
}

getReporteUsuarios(): Observable<any>{
  return this.http.get<any>(`${this.apiUrl}${this.ApiRpteUsuario}`,this.headers);
}

getAReporteCliente(): Observable<any>{
  return this.http.get<any>(`${this.apiUrl}${this.ApiRpreCliente}`,this.headers);
}

getReporteServicio(): Observable<any>{
  return this.http.get<any>(`${this.apiUrl}${this.apiReporteServicio}`,this.headers);
  }

  getReporteServicioFiltro(filtro:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return  this.http.post(`${this.apiUrl}${this.apiReporteServicioFiltros}`, filtro, {
      headers,
      responseType: 'blob'
    });
  }



  ConsultaDatosGenerales(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiConsultaDatosGenerales}?IdFormulario=${IdFormualio}`,this.headers);
  }


  ConsultaInformacionTributaria(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiConsultaInformacionTributaria}?IdFormulario=${IdFormualio}`,this.headers);
  }


  ConsultainfoOEA(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiConsultaInfoOEA}?IdFormulario=${IdFormualio}`,this.headers);
  }

  ConsultaDatosContactos(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiConsultaDatosContacto}?IdFormulario=${IdFormualio}`,this.headers);
  }


  ConsultaReferenciasFinancieras(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiConsultaReferencais}?IdFormulario=${IdFormualio}`,this.headers);
  }


  ConsultaDatosdepago(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiConsultaDatosPgo}?IdFormulario=${IdFormualio}`,this.headers);
  }

  ConsultaDespachoMercancia(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiConsultaDespachoMercancia}?IdFormulario=${IdFormualio}`,this.headers);
  }

  ConsultaCumplimiento(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiConsultaCumplimiento}?IdFormulario=${IdFormualio}`,this.headers);
  }

  ConsultaConflictoIntereses(IdFormulario: number): Observable<any> {
    return this.http.get<any>( `${this.apiUrl}${this.ApiConsultaConflictoIntereses}?IdFormulario=${IdFormulario}`, this.headers);
  }

  ConsultarInformacionComplementaria(IdFormulario: number): Observable<any> {
    return this.http.get<any>( `${this.apiUrl}${this.ApiConsultaInformacionComplementaria}?IdFormulario=${IdFormulario}`, this.headers);
  }

  ConsultaInformacionFinanciera(IdFormulario: number): Observable<any> {
    return this.http.get<any>( `${this.apiUrl}${this.ApiConsultaInformacionFinanciera}?IdFormulario=${IdFormulario}`, this.headers);
  }

  ConsultaDatosRevisorFiscal(IdFormulario: number): Observable<any> {
    return this.http.get<any>( `${this.apiUrl}${this.ApiConsultaDatosRevisorFiscal}?IdFormulario=${IdFormulario}`, this.headers);
  }

  ConsultaDeclaraciones(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiConsultaDeclaraciones}?IdFormulario=${IdFormualio}`,this.headers);
  }




  cosultaRepresentates(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiRepresentantelegal}?IdFormulario=${IdFormualio}`,this.headers);
  }


  cosultaAccionistas(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiconsultaAccionistas}?IdFormulario=${IdFormualio}`,this.headers);
  }


  cosultaJuntaDirectiva(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiconsultaJuntaDirectiva}?IdFormulario=${IdFormualio}`,this.headers);
  }
  //


  getUsuarioslist(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}${this.apiUsuarioslist}`,this.headers);
  }


  getCompradorVendedor(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}${this.apiCompradorVendedor}`,this.headers);
  }

  createnewUser(data:any): Observable<any>{
    return  this.http.post(`${this.apiUrl}${this.Apicreatenewuser}`, data, this.headers);
  }


  RechazarFomulario(data:any): Observable<any>{
    return  this.http.post(`${this.apiUrl}${this.ApiRechazarFomulario}`, data, this.headers);
  }

  editUser(data:any): Observable<any>{
    return  this.http.post(`${this.apiUrl}${this.Apiedituser}`, data, this.headers);
  }

  updatepassword(data:any): Observable<any>{
    return  this.http.post(`${this.apiUrl}${this.ApiUpdatepassword}`, data, this.headers);
  }

  GuardarInfoOEA(data:any): Observable<any>{
    return  this.http.post(`${this.apiUrl}${this.ApiGuardaInfoOEA}`, data, this.headers);
  }


  uploadFile2(file: File,key: string, idFormulario: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idFormulario', idFormulario.toString());
    formData.append('key', key);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.post(`${this.apiUrl}${this.apiUploadArchivosolo}`, formData, { headers });
  }




  uploadPdfEnviado(pdfBlob: Blob,idFormualrio:number): Observable<any> {
    const formData = new FormData();
    formData.append('file', pdfBlob, 'PDFEnviado_Formulario_'+idFormualrio+'.pdf');
    formData.append('idFormulario', idFormualrio.toString());
    formData.append('key', 'PDFEnviado');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });



    return this.http.post(`${this.apiUrl}${this.apiUploadArchivosolo}`, formData, { headers });
  }



  EliminaArchivoCargado(IdFormualio:number,key:string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}${this.apiEliminaArchivoCargado}?IdFormulario=${IdFormualio}&Key=${key}`,this.headers);
  }

  ConsultaArchivosSUBIDOS(IdFormualio:number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}${this.apiArchivosSubidos}?IdFormulario=${IdFormualio}`,this.headers);
  }


  descargarArchivo(key: string, idFormulario: number): Observable<Blob> {

    const currentToken = this.gettoken();

    if (!currentToken) {
      throw new Error('Token de autenticación no encontrado. Por favor, inicie sesión nuevamente.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${currentToken}`,
      'Content-Type': 'application/json'
    });

    const url = `${this.apiUrl}${this.apidESCARGARARCHIVO}?key=${encodeURIComponent(key)}&idFormulario=${idFormulario}`;

    console.log('URL de descarga:', url);
    console.log('Headers:', headers);

    return this.http.get(url, {
      headers,
      responseType: 'blob',
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<Blob>) => {
        console.log('Respuesta del servidor:', response);
        console.log('Status:', response.status);
        console.log('Headers de respuesta:', response.headers);

        if (response.body) {
          return response.body;
        } else {
          throw new Error('Respuesta vacía del servidor');
        }
      }),
      catchError((error: any) => {
        console.error('Error en descargarArchivo:', error);

        if (error.status === 401) {
          throw new Error('Token expirado o inválido. Por favor, inicie sesión nuevamente.');
        } else if (error.status === 403) {
          throw new Error('No tiene permisos para acceder a este archivo.');
        } else if (error.status === 404) {
          throw new Error('El archivo solicitado no fue encontrado.');
        } else if (error.status === 500) {
          throw new Error('Error interno del servidor al generar el archivo.');
        } else {
          throw new Error(`Error de red: ${error.message || 'Error desconocido'}`);
        }
      })
    );
  }

  descargarReporteInspektor(IdConsulta: number): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get(`${this.apiUrl}${this.apiDescargaInfoInkspektor}?IdConsulta=${IdConsulta}`, {
      headers,
      responseType: 'blob'
    });
  }

  ConsultaProcuraduria(data:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return  this.http.post(`${this.apiUrl}${this.ApiProcuraduria}`, data,  {
      headers,
      responseType: 'blob'
    });
  }

  ConsultaRamaJudicial(data:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return  this.http.post(`${this.apiUrl}${this.ApiRamaJudicial}`, data, {
      headers,
      responseType: 'blob'
    });
  }

  ConsultaEjecucionPenas(data:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return  this.http.post(`${this.apiUrl}${this.ApiEjecucionPneas}`, data, {
      headers,
      responseType: 'blob'
    });
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  // Método para verificar si existe un archivo específico antes de descargarlo
  verificarArchivoExiste(key: string, idFormulario: number): Observable<boolean> {
    const currentToken = this.gettoken();

    if (!currentToken) {
      throw new Error('Token de autenticación no encontrado.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${currentToken}`
    });

    const url = `${this.apiUrl}${this.apidESCARGARARCHIVO}?key=${encodeURIComponent(key)}&idFormulario=${idFormulario}`;

    return this.http.head(url, { headers, observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        console.log('Verificación HEAD response:', response.status);
        return response.status === 200;
      }),
      catchError((error: any) => {
        console.log('Archivo no existe o no accesible:', error.status);
        return [false];
      })
    );
  }

  // Método mejorado para obtener información detallada del error 404
  obtenerInformacionFormulario(idFormulario: number): Observable<any> {
    const currentToken = this.gettoken();

    if (!currentToken) {
      throw new Error('Token de autenticación no encontrado.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${currentToken}`
    });

    // Asumiendo que existe un endpoint para obtener detalles del formulario
    return this.http.get(`${this.apiUrl}RegistroFormulario/DetalleFormulario/${idFormulario}`, {
      headers
    }).pipe(
      catchError((error: any) => {
        console.error('Error al obtener información del formulario:', error);
        return [null];
      })
    );
  }

//apiUploadArchivosolo

  // Método de descarga que funciona igual que el botón de la lupa
  descargarArchivoConVerificacion(key: string, idFormulario: number): Observable<Blob> {
    console.log('=== DESCARGA CON VERIFICACIÓN (igual que la lupa) ===');
    console.log('Formulario ID:', idFormulario, 'Key:', key);

    // PRIMERO: Verificar que el archivo existe (igual que la lupa)
    return this.ConsultaArchivosSUBIDOS(idFormulario).pipe(
      switchMap((archivos: any) => {
        console.log('Archivos encontrados:', archivos);

        const archivoEncontrado = archivos?.find((archivo: any) =>
          archivo.key === key ||
          archivo.tipoArchivo === key ||
          (key === 'PDFEnviado' && archivo.key === 'PDFEnviado')
        );

        if (!archivoEncontrado) {
          console.log('PDF no encontrado en la lista de archivos');
          throw new Error(`No se encontró archivo con key '${key}' para el formulario ${idFormulario}. El PDF debe generarse primero.`);
        }

        console.log('PDF confirmado, procediendo con descarga:', archivoEncontrado);

        // SEGUNDO: Si existe, proceder con descarga (igual que la lupa)
        return this.descargarArchivo(key, idFormulario);
      }),
      catchError((error: any) => {
        console.error('Error en descarga con verificación:', error);
        throw error;
      })
    );
  }

  obtenerFormularioCompleto(idFormulario: number): Observable<any> {
    // Realizar todas las consultas en paralelo
    const consultasParalelas = {
      datosGenerales: this.ConsultaDatosGenerales(idFormulario).pipe(catchError(() => of(null))),
      informacionTributaria: this.ConsultaInformacionTributaria(idFormulario).pipe(catchError(() => of(null))),
      datosContacto: this.ConsultaDatosContactos(idFormulario).pipe(catchError(() => of(null))),
      referenciasBancarias: this.ConsultaReferenciasFinancieras(idFormulario).pipe(catchError(() => of(null))),
      datosPago: this.ConsultaDatosdepago(idFormulario).pipe(catchError(() => of(null))),
      representanteLegal: this.cosultaRepresentates(idFormulario).pipe(catchError(() => of(null))),
      accionistas: this.cosultaAccionistas(idFormulario).pipe(catchError(() => of(null))),
      juntaDirectiva: this.cosultaJuntaDirectiva(idFormulario).pipe(catchError(() => of(null))),
      informacionFinanciera: this.ConsultaInformacionFinanciera(idFormulario).pipe(catchError(() => of(null))),
      datosRevisorFiscal: this.ConsultaDatosRevisorFiscal(idFormulario).pipe(catchError(() => of(null))),
      declaraciones: this.ConsultaDeclaraciones(idFormulario).pipe(catchError(() => of(null))),
      cumplimiento: this.ConsultaCumplimiento(idFormulario).pipe(catchError(() => of(null))),
      conflictoIntereses: this.ConsultaConflictoIntereses(idFormulario).pipe(catchError(() => of(null))),
      informacionComplementaria: this.ConsultarInformacionComplementaria(idFormulario).pipe(catchError(() => of(null))),
      despachoMercancia: this.ConsultaDespachoMercancia(idFormulario).pipe(catchError(() => of(null))),
      infoOEA: this.ConsultainfoOEA(idFormulario).pipe(catchError(() => of(null)))
    };

    return forkJoin(consultasParalelas).pipe(
      map(resultados => {
        // Combinar todos los resultados en un objeto único
        return {
          id: idFormulario,
          // Datos Generales
          ...resultados.datosGenerales,
          // Información Tributaria
          informacionTributaria: resultados.informacionTributaria,
          // Datos de Contacto
          datosContacto: resultados.datosContacto,
          // Referencias Bancarias
          referenciasBancarias: resultados.referenciasBancarias,
          // Datos de Pago
          datosPago: resultados.datosPago,
          // Representante Legal
          representanteLegal: resultados.representanteLegal,
          // Accionistas
          accionistas: resultados.accionistas,
          // Junta Directiva
          juntaDirectiva: resultados.juntaDirectiva,
          // Información Financiera
          informacionFinanciera: resultados.informacionFinanciera,
          // Revisor Fiscal
          datosRevisorFiscal: resultados.datosRevisorFiscal,
          // Declaraciones
          declaraciones: resultados.declaraciones,
          // Cumplimiento
          cumplimiento: resultados.cumplimiento,
          // Conflicto de Intereses
          conflictoIntereses: resultados.conflictoIntereses,
          // Información Complementaria
          informacionComplementaria: resultados.informacionComplementaria,
          // Despacho de Mercancía
          despachoMercancia: resultados.despachoMercancia,
          // Información OEA
          infoOEA: resultados.infoOEA
        };
      }),
      catchError(error => {
        console.error('Error obteniendo datos completos del formulario:', error);
        throw error;
      })
    );
  }

}
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export function soloLetrasValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    return regex.test(control.value) ? null : { soloLetras: true };
  };
}
