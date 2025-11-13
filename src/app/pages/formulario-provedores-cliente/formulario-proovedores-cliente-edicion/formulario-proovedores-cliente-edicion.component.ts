import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../Services/main.services';
import { DatosGeneralesComponent } from '../../DatosGenerales/datos-generales/datos-generales.component';
import { DatosGeneralesDto } from '../../Models/DatosGeneralesDto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../../utils/alert-modal/alert-modal.component';
import { InternalDataService } from '../../Services/InternalDataService';
import { Router } from '@angular/router';
import { DatosContactoComponent } from '../../DatosContacto/datos-contacto/datos-contacto.component';
import { ReferenciasComercialesBancariasComponent } from '../../ReferenciasComercialesBancarias/referencias-comerciales-bancarias/referencias-comerciales-bancarias.component';
import { DatosDePagoComponent } from '../../DatosPago/datos-de-pago/datos-de-pago.component';
import { CumplimientoNormativoComponent } from '../../CumplimientoNormativo/cumplimiento-normativo/cumplimiento-normativo.component';
import { DespachoDeMercanciaComponent } from '../../DespachoDeMercancia/despacho-de-mercancia/despacho-de-mercancia.component';
import { DatosAdjuntosComponent } from '../../DatosAdjuntos/datos-adjuntos/datos-adjuntos.component';
import { RepresentanteLegalComponent } from '../../representante-legal/representante-legal.component';
import { AccionistasComponent } from '../../Accionistas/accionistas/accionistas.component';
import { JuntaDirectivaComponent } from '../../JuntaDirectiva/junta-directiva/junta-directiva.component';
import { AlertaGuardadoSinValidacionComponent } from '../../utils/alerta-guardado-sin-validacion/alerta-guardado-sin-validacion.component';
import { catchError, forkJoin, switchMap, throwError } from 'rxjs';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { RechazoModalComponent } from '../../utils/rechazo-modal/rechazo-modal.component';
import { MotivoRechazo } from '../../Models/MotivoRechazoDto';
import { ConflictoInteresComponent } from '../../conflictoInteres/conflicto-intereses/conflicto-interes.component';
import { InformacionComplementariaComponent } from '../../InformacionComplementaria/informacion-complementaria/informacion-complementaria.component';
import { DatosRevisorFiscalComponent } from '../../DatosRevisorFiscal/datos-revisorfiscal/datos-revisorfiscal.component';
import { InformacionTributariaComponent } from '../../InformacionTributaria/informacion-tributaria/informacion-tributaria.component';
import { DeclaracionesComponent } from '../../Declaraciones/declaraciones/declaraciones.component';
import { InformacionFinancieraComponent } from '../../InformacionFinanciera/informacion-financiera/informacion-financiera.component';
declare var bootstrap: any;

@Component({
  selector: 'app-formulario-proveedores-clientes-edicion',
  templateUrl: './formulario-proovedores-cliente-edicion.component.html',
  styleUrl: './formulario-proovedores-cliente-edicion.component.scss'
})
export class FormularioProovedoresClienteEdicionComponent implements OnInit, AfterViewInit {//CumplimientoNormativoComponent


  @ViewChild(DatosGeneralesComponent) componenteDatosGenerales: DatosGeneralesComponent;
  @ViewChild(DatosContactoComponent) componenteDatosContacto: DatosContactoComponent;
  @ViewChild(ReferenciasComercialesBancariasComponent) componenteReferenciasComBn: ReferenciasComercialesBancariasComponent;
  @ViewChild(DatosDePagoComponent) DatosDePagos: DatosDePagoComponent;
  @ViewChild(DatosRevisorFiscalComponent) DatosRevisorFiscalComponent: DatosRevisorFiscalComponent;
  @ViewChild(CumplimientoNormativoComponent) CumplimientoNormativo: CumplimientoNormativoComponent;
  @ViewChild(ConflictoInteresComponent) ConflictoInteresComponent: ConflictoInteresComponent;
  @ViewChild(InformacionComplementariaComponent) InformacionComplementariaComponent: InformacionComplementariaComponent;
  @ViewChild(InformacionFinancieraComponent) InformacionFinancieraComponent: InformacionFinancieraComponent;
  @ViewChild(DespachoDeMercanciaComponent) DespachoDeMercancia: DespachoDeMercanciaComponent; //DatosAdjuntosComponent
  @ViewChild(DatosAdjuntosComponent) DatosAduntos: DatosAdjuntosComponent;
  @ViewChild(RepresentanteLegalComponent) DatosRepresentantes: RepresentanteLegalComponent;
  @ViewChild(InformacionTributariaComponent) componenteInformacionTriburaria: InformacionTributariaComponent;
  @ViewChild(AccionistasComponent) DatosAccionistas: AccionistasComponent;
  @ViewChild(DeclaracionesComponent) Declaraciones: DeclaracionesComponent;

  @ViewChild(JuntaDirectivaComponent) DatosJuntaDirectiva: JuntaDirectivaComponent;

  @ViewChild('myTab', { static: false }) tabContainer: ElementRef;
  FormularioService: any = {};
  FechaFormulario: string;
  isLoading = false;
  private modalService = inject(NgbModal);
  Lang: string = 'es';
  Listatiposolicitud: any[] = [];
  ListaClaseTerceros: any[] = [];
  ListaTipoDocumentos: any[] = [];
  ListaSino: any[] = [];
  ListaPaises: any[] = [];
  ListaTamanoterceros: any[] = [];
  ListaActividadesEco: any[] = [];
  ListaCategoriaTerceros: any[] = [];
  ListaTipoCuentaBancaria: any[] = [];
  ListaTipoReferencia: any[] = [];
  isbolean: boolean = false;
  mostrarTabDespachos: boolean = true;
  mostrarTabRepresentanteLegal: boolean = true;
  mostrarTabAccionistas: boolean = true;
  mostrarTabDeclaraciones: boolean = true;
  mostrarTabInformacionTriburaria: boolean = true;
  mostrarTabInfoFinanciera: boolean = true;
  mostrarTabDatosRevisorFiscal: boolean = true;
  mostrarTabDatosdeContacto: boolean = true;
  mostrarTabInformacionComplementaria: boolean = true;
  mostrarTabConflictoInteres: boolean = true;
  mostrarTabReferenciasBancarias: boolean = true;
  mostrarTabDatosdepagos: boolean = true;
  mostrarTabCumplimientoNormativo: boolean = true;
  claseTerceroEsProveedor: boolean = true
  claseTerceroIsAliado: boolean = true;
  public categoriaActual: string = '';
  IdFormulario: number;
  IdEstadoFormulario: number = 0;
  tipousuario: string;
  Estado: string;
  idClaseTercero: string;
  idCategoriaTercero: string;
  nivelRiesgo: string = '';
  totalRiesgo: number = 0;
  razonPaisCorrupcion: string = '';
  razonPaisGAFI: string = '';

  categoriaTercero: string = '';
  categoriaTerceroRiesgo: string = '';
  cotizaEnBolsa: string = '';
  cotizaEnBolsa_SiNoRiesgo: string = '';
  esPEP: string = '';
  esPEP_SiNoRiesgo: string = '';
  fechaCalculo: string = '';
  id: string = '';
  idFormulario: string = '';
  manejaActivosVirtuales: string = '';
  manejaActivosVirtuales_SiNoRiesgo: string = '';
  manejaEfectivo: string = '';
  manejaEfectivo_SiNoRiesgo: string = '';
  nivelRiesgoFinal: string = '';
  nombrePais: string = '';
  paisRiesgoCorrupcion: string = '';
  paisRiesgoGAFI: string = '';
  tamanoSociedadRiesgo: string = '';
  tamanoTercero: string = '';
  valorActivosVirtuales: string = '';
  valorCotizaBolsa: string = '';
  valorOperacionesEfectivo: string = '';
  valorPEP: string = '';
  valorPaisCorrupcion: string = '';
  valorPaisGAFI: string = '';
  valorPersona: string = '';
  valorTamano: string = '';
  private readonly personaRiskMap: Record<number, string> = { 8: 'Alto', 0: 'Bajo' };
  private readonly tamanoRiskMap: Record<number, string> = { 0: 'Bajo', 8: 'Medio', 9: 'Alto' };
  private readonly pepRiskMap: Record<number, string> = { 8: 'Alto', 0: 'Bajo' };
  private readonly cotizaRiskMap: Record<number, string> = { 2: 'Medio', 0: 'Bajo' };
  private readonly efectivoRiskMap: Record<number, string> = { 25: 'Alto', 0: 'Bajo' };
  private readonly activosRiskMap: Record<number, string> = { 25: 'Alto', 0: 'Bajo' };
  private readonly paisRiskMap: Record<number, string> = { 25: 'Alto', 9: 'Medio', 1: 'Bajo', 0: 'Bajo' };

  classClient = false;
  classProveedor = false;
  classAliado = false;
  esPersonaNatural = false;
  esPersonaJuridica = false;

  isCapturing = false;
    mostrarIndicadores: boolean = false;


  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder, private translate: TranslateService, private serviciocliente: ServicioPrincipalService, private ServicioEdit: InternalDataService, private router: Router, private renderer: Renderer2, private cdRef: ChangeDetectorRef) {


    this.translate.setDefaultLang('es');
    // Opcional: cargar el idioma basado en una preferencia del usuario
    this.Lang = localStorage.getItem('language') || 'es';
    this.translate.use(this.Lang);



  }

  async CrearNuevoForm() {


  }

  loadTipoSolicitud(): void {
    this.serviciocliente.ListTipoSolicitud(this.Lang).subscribe(data => {
      this.Listatiposolicitud = data;
    });
  }

  loadCLaseTerceros(): void {
    this.serviciocliente.ListClaseTercero(this.Lang).subscribe(data => {
      this.ListaClaseTerceros = data;
    });
  }

  loadSino(): void {
    this.serviciocliente.ListaSINO(this.Lang).subscribe(data => {
      this.ListaSino = data;
    });
  }

  loadCategoriaTerceros(): void {
    this.serviciocliente.ListCategoriaTercero(this.Lang).subscribe(data => {
      this.ListaCategoriaTerceros = data;
    });
  }

  loadTiposDocumentos(): void {
    this.serviciocliente.ListaTiposDocumentos(this.Lang).subscribe(data => {
      this.ListaTipoDocumentos = data;
    });
  }

  loadPaises(): void {
    this.serviciocliente.ListPaises(this.Lang).subscribe(data => {
      this.ListaPaises = data;
    });
  }

  loadTamañoTerceros(): void {
    this.serviciocliente.ListTamañoTercero(this.Lang).subscribe(data => {
      this.ListaTamanoterceros = data;
    });
  }
  loadActividadesEco(): void {
    this.serviciocliente.ListActividadEconomica(this.Lang).subscribe(data => {
      this.ListaActividadesEco = data;
    });
  }

  loadTipoCuentaBanc(): void {
    this.serviciocliente.ListaTiposCuentaBancaria(this.Lang).subscribe(data => {
      this.ListaTipoCuentaBancaria = data;
    });

  }
  loadTipoReferencia(): void {
    this.serviciocliente.ListaTipoReferencia(this.Lang).subscribe(data => {
      this.ListaTipoReferencia = data;
    });

  }


  toggleIndicadores(): void {
    this.mostrarIndicadores = !this.mostrarIndicadores;
  }

  async ngOnInit(): Promise<void> {


    this.FormularioService = this.ServicioEdit.getNuevoFormulario();
    if (this.FormularioService === null || this.FormularioService === undefined) {
      this.router.navigate(['/pages/dash/ListaFormulariosUsuario']);
      return;
    } else {
      this.IdFormulario = this.FormularioService.id;
      this.FechaFormulario = this.FormularioService.fechaFormulario;
      this.IdEstadoFormulario = this.FormularioService.idEstado;
      this.Estado = this.FormularioService.estado;
      if (this.IdEstadoFormulario === 3 || this.IdEstadoFormulario === 4) {
        this.serviciocliente.ObtenerRiesgoFormulario(this.IdFormulario)
          .subscribe({
            next: (riesgo) => {
              console.log('nivel de riesgo', riesgo);
              this.setRiesgoData(riesgo);
            },
            error: (err) => console.error('Error consultando riesgo:', err)
          });
      }
      this.loadTipoSolicitud();
      this.loadCLaseTerceros();
      this.loadSino();
      this.loadCategoriaTerceros();
      this.loadTiposDocumentos();
      this.loadPaises();
      this.loadTamañoTerceros();
      this.loadActividadesEco();
      this.initializeForm();         // Inicializa el formulario
      //this.initializeFormSubscriptions(); // Establece las suscripciones
      this.getFechaActual();
      this.loadTipoCuentaBanc();
      this.loadTipoReferencia();
    }
    this.serviciocliente.ConsultaDatosGenerales(this.IdFormulario).subscribe(obj => {
      if (!obj) {
        return;
      }
      if (obj.claseTercero === 1) {
        this.classClient = true;
        this.classProveedor = false;
        this.classAliado = false;
      } else if (obj.claseTercero === 2) {
        this.classClient = false;
        this.classProveedor = true;
        this.classAliado = false;
      } else if (obj.claseTercero === 3) {
        this.classClient = false;
        this.classProveedor = false;
        this.classAliado = true;
        this.mostrarTabInformacionTriburaria = false;
        this.mostrarTabDatosdepagos = false;
        this.mostrarTabDatosdeContacto = true;
      }

      if (obj.categoriaTercero === 3) {
        this.esPersonaNatural = true;
        this.esPersonaJuridica = false;
      } else if (obj.categoriaTercero === 2) {
        this.esPersonaNatural = false;
        this.esPersonaJuridica = true;
      }


      this.verificarPestanasConDatos();

      this.aplicarVisibilidadTabsSegunEstadoYRol();

      this.cdr.detectChanges();
    })

    console.log('idEstado formulario:', this.IdEstadoFormulario);
    this.IdEstadoFormulario = Number(this.IdEstadoFormulario);
  }

  ngAfterViewInit(): void {
    const catControl = this.componenteDatosGenerales?.formulario.get('categoriaTercero');
    this.cdr.detectChanges();

    if (this.componenteDatosGenerales) {

    }

    if (catControl) {
      catControl.valueChanges.subscribe(valor => {
        this.categoriaActual = valor;
      });
      this.categoriaActual = catControl.value;
    }

    this.serviciocliente.CurrentUser().subscribe((data: any) => {
      console.log(data.rol);

      this.tipousuario = data.rol;



      if (this.IdEstadoFormulario === 8 && this.tipousuario === 'Oficial de Cumplimiento') {
        this.abrirModalVerFormulario();
      }
    });


  }

  abrirModalVerFormulario(): void {

    this.serviciocliente.MotivoRechazoservice(this.IdFormulario).subscribe(data => {

      const modalRef = this.modalService.open(RechazoModalComponent, {
        centered: true,
        windowClass: 'custom-modal-width'
      });
      modalRef.componentInstance.formularioId = this.IdFormulario;
      modalRef.componentInstance.isReadOnly = true;
      modalRef.componentInstance.initialMotivo = data.motivoRechazo;

      modalRef.result.then((result) => {

      }, (reason) => {
      });

    });



  }


  // vision de los tabs
  onTabVisibilityChange(event: {
    tabDespachos: boolean,
    tabRepresentanteLegal: boolean,
    tabPrinProvAndClient: boolean,
    tabIsAliado: boolean,
    tabInformacionTriburaria: boolean,
    tabDeclaraciones: boolean,
    tabInfoFinanciera: boolean,
    tabRevisorFiscal: boolean,
    tabDatosdeContacto: boolean,
    tabInformacionComplementaria: boolean,
    tabConflictoInteres: boolean,
    tabReferenciasBancarias: boolean,
    tabCumplimientoNormativo: boolean,
    tabDatosRevisorFiscal: boolean,
    tabDatosdepagos: boolean
  }): void {
    this.mostrarTabDespachos = event.tabDespachos;
    this.mostrarTabRepresentanteLegal = event.tabRepresentanteLegal;
    this.claseTerceroEsProveedor = event.tabPrinProvAndClient;
    this.mostrarTabReferenciasBancarias = event.tabReferenciasBancarias ?? event.tabPrinProvAndClient; // Agregar esta línea
    this.mostrarTabInfoFinanciera = event.tabInfoFinanciera;
    this.claseTerceroIsAliado = event.tabIsAliado;


    if (!this.mostrarTabInformacionTriburaria) {
      this.mostrarTabInformacionTriburaria = event.tabInformacionTriburaria;
    }

    this.mostrarTabDeclaraciones = event.tabDeclaraciones;
    this.mostrarTabDatosRevisorFiscal = event.tabDatosRevisorFiscal;
    this.mostrarTabDatosdeContacto = event.tabDatosdeContacto;
    this.mostrarTabInformacionComplementaria = event.tabInformacionComplementaria;
    this.mostrarTabConflictoInteres = event.tabConflictoInteres;
    this.mostrarTabDatosdepagos = event.tabDatosdepagos;
    this.mostrarTabCumplimientoNormativo = event.tabCumplimientoNormativo;

    if (this.classAliado) {
      this.mostrarTabInformacionTriburaria = false;
      this.mostrarTabConflictoInteres = true;
    }
  }

  private setRiesgoData(riesgo: any): void {
    if (!riesgo) {
      return;
    }

    this.nivelRiesgo = riesgo.nivelRiesgoFinal ?? this.nivelRiesgo;
    this.totalRiesgo = riesgo.totalRiesgo ?? this.totalRiesgo;
    this.categoriaTercero = riesgo.categoriaTercero ?? this.categoriaTercero;
    this.categoriaTerceroRiesgo = riesgo.categoriaTerceroRiesgo || this.mapCategoriaRiesgo(riesgo.valorPersona);
    this.cotizaEnBolsa = riesgo.cotizaEnBolsa ?? this.cotizaEnBolsa;
    this.cotizaEnBolsa_SiNoRiesgo = riesgo.cotizaEnBolsa_SiNoRiesgo || this.mapCotizaRisk(riesgo.valorCotizaBolsa);
    this.esPEP = riesgo.esPEP ?? this.esPEP;
    this.esPEP_SiNoRiesgo = riesgo.esPEP_SiNoRiesgo || this.mapPepRisk(riesgo.valorPEP);
    this.fechaCalculo = riesgo.fechaCalculo ?? this.fechaCalculo;
    this.id = riesgo.id ?? this.id;
    this.idFormulario = riesgo.idFormulario ?? this.idFormulario;
    this.manejaActivosVirtuales = riesgo.manejaActivosVirtuales ?? this.manejaActivosVirtuales;
    this.manejaActivosVirtuales_SiNoRiesgo = riesgo.manejaActivosVirtuales_SiNoRiesgo || this.mapActivosRisk(riesgo.valorActivosVirtuales);
    this.manejaEfectivo = riesgo.manejaEfectivo ?? this.manejaEfectivo;
    this.manejaEfectivo_SiNoRiesgo = riesgo.manejaEfectivo_SiNoRiesgo || this.mapOperacionesRisk(riesgo.valorOperacionesEfectivo);
    this.nivelRiesgoFinal = riesgo.nivelRiesgoFinal ?? this.nivelRiesgoFinal;
    this.nombrePais = riesgo.nombrePais ?? this.nombrePais;
    this.paisRiesgoCorrupcion = riesgo.paisRiesgoCorrupcion || this.mapPaisRisk(riesgo.valorPaisCorrupcion);
    this.paisRiesgoGAFI = riesgo.paisRiesgoGAFI || this.mapPaisRisk(riesgo.valorPaisGAFI);
    this.tamanoSociedadRiesgo = riesgo.tamanoSociedadRiesgo || this.mapTamanoRisk(riesgo.valorTamano);
    this.tamanoTercero = riesgo.tamanoTercero ?? this.tamanoTercero;
    this.valorActivosVirtuales = riesgo.valorActivosVirtuales ?? this.valorActivosVirtuales;
    this.valorCotizaBolsa = riesgo.valorCotizaBolsa ?? this.valorCotizaBolsa;
    this.valorOperacionesEfectivo = riesgo.valorOperacionesEfectivo ?? this.valorOperacionesEfectivo;
    this.valorPEP = riesgo.valorPEP ?? this.valorPEP;
    this.valorPaisCorrupcion = riesgo.valorPaisCorrupcion ?? this.valorPaisCorrupcion;
    this.valorPaisGAFI = riesgo.valorPaisGAFI ?? this.valorPaisGAFI;
    this.valorPersona = riesgo.valorPersona ?? this.valorPersona;
    this.valorTamano = riesgo.valorTamano ?? this.valorTamano;
  }

  private mapCategoriaRiesgo(value: any): string | null {
    return this.resolveRiskLevel(value, this.personaRiskMap);
  }

  private mapTamanoRisk(value: any): string | null {
    return this.resolveRiskLevel(value, this.tamanoRiskMap);
  }

  private mapPepRisk(value: any): string | null {
    return this.resolveRiskLevel(value, this.pepRiskMap);
  }

  private mapCotizaRisk(value: any): string | null {
    return this.resolveRiskLevel(value, this.cotizaRiskMap);
  }

  private mapOperacionesRisk(value: any): string | null {
    return this.resolveRiskLevel(value, this.efectivoRiskMap);
  }

  private mapActivosRisk(value: any): string | null {
    return this.resolveRiskLevel(value, this.activosRiskMap);
  }

  private mapPaisRisk(value: any): string | null {
    return this.resolveRiskLevel(value, this.paisRiskMap);
  }

  private resolveRiskLevel(value: any, dictionary: Record<number, string>): string | null {
    const numeric = this.toNumeric(value);
    if (numeric === null) {
      return null;
    }

    const directMatch = dictionary[numeric];
    if (directMatch) {
      return directMatch;
    }

    if (numeric >= 20) {
      return 'Alto';
    }

    if (numeric >= 5) {
      return 'Medio';
    }

    if (numeric >= 0) {
      return 'Bajo';
    }

    return null;
  }

  private toNumeric(value: any): number | null {
    if (value === null || value === undefined) {
      return null;
    }
    if (typeof value === 'number' && !Number.isNaN(value)) {
      return value;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  formatYesNo(value: any): string {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No';
    }
    const normalized = value.toString().trim().toLowerCase();
    if (['si', 'sí', 'true', '1'].includes(normalized)) {
      return 'Sí';
    }
    if (['no', 'false', '0'].includes(normalized)) {
      return 'No';
    }
    return value;
  }

  getRiskBadgeClass(value: string | null | undefined): string {
  }


  onClaseTerceroChange(event: { idClaseTercero: string }): void {
    this.idClaseTercero = event.idClaseTercero;

  }

  onCategoriaChange(event: { idCategoriaTercero: string }): void {
    // this.idCategoriaTercero = event.idCategoriaTercero;
    const valor = parseInt(event.idCategoriaTercero, 10);
    this.idCategoriaTercero = event.idCategoriaTercero;
    this.mostrarTabDatosRevisorFiscal = valor !== 3;
    this.mostrarTabAccionistas = valor !== 3;

  }



  onAdjuntosFormReady(event: any) {



  }

  private initializeForm(): void {

  }



  private getFechaActual(): string {
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const anio = fechaActual.getFullYear();
    return `${anio}-${mes}-${dia}`;
  }


  alMenosUnoSeleccionado(group: FormGroup): { [key: string]: any } | null {
    const { ambas, ekoRed, enka } = group.value;
    return ambas || ekoRed || enka ? null : { requerido: true };
  }

  enviarFormulario(): void {
  }





  // Enviar el formulario completo
  public async Enviar() {
    this.showLoadingModal();

    try {
      await new Promise(resolve => setTimeout(resolve, 300));


      if (!this.componenteDatosGenerales) {
        throw new Error('componenteDatosGenerales es undefined. Revisa @ViewChild y el HTML.');
      }
      if (!this.componenteDatosGenerales.esFormularioValido()) {
        const camnposinvalidod = this.componenteDatosGenerales.obtenerCamposInvalidos();

        this.componenteDatosGenerales.marcarFormularioComoTocado();
        this.seleccionarTab2('DatosGenerales-tab');
        this.hideLoadingModal();
        return;
      }


      const datosGenerales = this.componenteDatosGenerales.obtenerDatosFormulario(true);

      if (datosGenerales.claseTercero === '1') {
        if (!this.DespachoDeMercancia) {
          throw new Error('DespachoDeMercancia es undefined. Revisa @ViewChild y el HTML.');
        }
        if (!this.DespachoDeMercancia.esFormularioValido()) {
          this.DespachoDeMercancia.marcarFormularioComoTocado();
          this.seleccionarTab2('Despachodemercancia-tab');
          this.hideLoadingModal();
          return;
        }
      }


      if (datosGenerales.categoriaTercero !== '3') {
        if (!this.DatosRepresentantes) {
          throw new Error('DatosRepresentantes es undefined. Revisa @ViewChild y el HTML.');
        }
        if (!this.DatosRepresentantes.esFormularioValido()) {
          this.DatosRepresentantes.marcarFormularioComoTocado();
          this.seleccionarTab2('RepresentanteLegal-tab');
          this.hideLoadingModal();
          return;
        }

        if (!this.DatosJuntaDirectiva) {
          throw new Error('DatosJuntaDirectiva es undefined. Revisa @ViewChild y el HTML.');
        }
        if (!this.DatosJuntaDirectiva.esFormularioValido()) {
          this.DatosJuntaDirectiva.marcarFormularioComoTocado();
          this.seleccionarTab2('JuantaDirectiva-tab');
          this.hideLoadingModal();
          return;
        }

        if (!this.DatosAccionistas) {
          throw new Error('DatosAccionistas es undefined. Revisa @ViewChild y el HTML.');
        }
        if (!this.DatosAccionistas.esFormularioValido()) {
          this.DatosAccionistas.marcarFormularioComoTocado();
          this.seleccionarTab2('Accionistas-tab');
          this.hideLoadingModal();
          return;
        }
      }

      if (datosGenerales.pais === '43') {
        if (!this.componenteInformacionTriburaria) {
          throw new Error('componenteInformacionTriburaria es undefined. Revisa @ViewChild y el HTML.');
        }
        if (!this.componenteInformacionTriburaria.esFormularioValido()) {
          this.componenteInformacionTriburaria.marcarFormularioComoTocado();
          this.seleccionarTab2('InformacionTributaria-tab');
          this.hideLoadingModal();
          return;
        }
      }

      if (!this.componenteDatosContacto) {
        throw new Error('componenteDatosContacto es undefined. Revisa @ViewChild y el HTML.');
      }

      if (!this.componenteDatosContacto.esFormularioValido()) {
        this.componenteDatosContacto.marcarFormularioComoTocado();
        this.seleccionarTab2('DatosdeContacto-tab');
        this.hideLoadingModal();
        return;
      }


      if (!this.DatosDePagos) {
        throw new Error('DatosDePagos es undefined. Revisa @ViewChild y el HTML.');
      }
      if (!this.DatosDePagos.esFormularioValido()) {
        this.DatosDePagos.marcarFormularioComoTocado();
        this.seleccionarTab2('Datosdepagos-tab');
        this.hideLoadingModal();
        return;
      }


      if (!this.CumplimientoNormativo) {
        throw new Error('CumplimientoNormativo es undefined. Revisa @ViewChild y el HTML.');
      }
      if (!this.CumplimientoNormativo.esFormularioValido()) {
        this.CumplimientoNormativo.marcarFormularioComoTocado();
        this.seleccionarTab2('CumplimientoNormativo-tab');
        this.hideLoadingModal();
        return;
      }

      if (!this.DatosAduntos) {
        throw new Error('DatosAduntos es undefined. Revisa @ViewChild y el HTML.');
      }
      if (!this.DatosAduntos.esFormularioValido()) {
        this.DatosAduntos.marcarFormularioComoTocado();
        this.seleccionarTab2('Adjuntos-tab');
        this.hideLoadingModal();
        return;
      }

      if (!this.Declaraciones) {
        throw new Error('Declaraciones es undefined. Revisa @ViewChild y el HTML.');
      }
      if (!this.Declaraciones.esFormularioValido()) {
        this.Declaraciones.marcarFormularioComoTocado();
        this.seleccionarTab2('Declaraciones-tab');
        this.hideLoadingModal();
        return;
      }


      if (this.InformacionFinancieraComponent && this.mostrarTabInfoFinanciera) {
        if ((this.InformacionFinancieraComponent as any).esFormularioValido && !(this.InformacionFinancieraComponent as any).esFormularioValido()) {
          (this.InformacionFinancieraComponent as any).marcarFormularioComoTocado?.();
          this.seleccionarTab2('InformacionFinanciera-tab');
          this.hideLoadingModal();
          return;
        }
      }

      if (this.DatosRevisorFiscalComponent && this.mostrarTabDatosRevisorFiscal) {
        if (this.DatosRevisorFiscalComponent.esFormularioValido && !this.DatosRevisorFiscalComponent.esFormularioValido()) {
          this.DatosRevisorFiscalComponent.marcarFormularioComoTocado?.();
          this.seleccionarTab2('DatosRevisorFiscal-tab');
          this.hideLoadingModal();
          return;
        }
      }


      if (this.InformacionComplementariaComponent && this.mostrarTabInformacionComplementaria) {
        if ((this.InformacionComplementariaComponent as any).esFormularioValido && !(this.InformacionComplementariaComponent as any).esFormularioValido()) {
          (this.InformacionComplementariaComponent as any).marcarFormularioComoTocado?.();
          this.seleccionarTab2('InformacionComplementaria-tab');
          this.hideLoadingModal();
          return;
        }
      }


      if (this.ConflictoInteresComponent && this.mostrarTabConflictoInteres) {
        if ((this.ConflictoInteresComponent as any).esFormularioValido && !(this.ConflictoInteresComponent as any).esFormularioValido()) {
          (this.ConflictoInteresComponent as any).marcarFormularioComoTocado?.();
          this.seleccionarTab2('ConflictoInteres-tab');
          this.hideLoadingModal();
          return;
        }
      }

      const requests = [];
      const DatosGenerarles: DatosGeneralesDto = {
        Id: datosGenerales.Id,
        IdFormulario: this.IdFormulario,
        FechaDiligenciamiento: this.FechaFormulario,
        Empresa: datosGenerales.empresa,
        TipoSolicitud: datosGenerales.tipoSolicitud,
        ClaseTercero: parseInt(datosGenerales.claseTercero),
        CategoriaTercero: parseInt(datosGenerales.categoriaTercero),
        NombreRazonSocial: datosGenerales.nombreRazonSocial,
        TipoIdentificacion: datosGenerales.tipoIdentificacion,
        NumeroIdentificacion: datosGenerales.numeroIdentificacion,
        DigitoVerificacion: datosGenerales.digitoVerificacion,
        Pais: datosGenerales.pais,
        Ciudad: datosGenerales.Ciudad,
        TamanoTercero: datosGenerales.tamanoTercero,
        ActividadEconimoca: datosGenerales.ActividadEconomicatab1,
        DireccionPrincipal: datosGenerales.DireccionPrincipal,
        codigoPostal: datosGenerales.CodigoPostalTab1,
        CorreoElectronico: datosGenerales.CorreoElectronicoTab1,
        Telefono: datosGenerales.TelefornoTab1,
        ObligadoFE: datosGenerales.ObligadoFacturarElectronicatab1,
        EstadoCivil: datosGenerales.estadoCivil,
        ConyugeIdentificacion: datosGenerales.conyugeIdentificacion,
        TipoPago: datosGenerales.tipoPago,
        CertBASC: datosGenerales.basc,
        CertOEA: datosGenerales.oea,
        CertCTPAT: datosGenerales.ctpat,
        CertOtros: datosGenerales.otros,
        CertNinguno: datosGenerales.ninguno,
        CorreoElectronicoFE: datosGenerales.correoElectronicoFE,
        TieneSucursalesOtrosPaises: datosGenerales.TieneSucursalesOtrosPaisestab1,
        PaisesOtrasSucursales: datosGenerales.PaisesOtrasSucursalestab1?.join(', '),
        PreguntasAdicionales: datosGenerales.preguntasAdicionales
      };

      requests.push(
        this.serviciocliente.GuardarDatosGnerales(DatosGenerarles).pipe(
          catchError(error => {
            console.error('[GuardarDatosGenerales] Error:', error);
            return throwError(error);
          })
        )
      );

      if (datosGenerales.claseTercero === '1') {
        const formDespacho = {
          ...this.DespachoDeMercancia.obtenerDatosFormulario(true),
          IdFormulario: this.IdFormulario
        };
        requests.push(
          this.serviciocliente.GuardarDespachoMercancia(formDespacho).pipe(
            catchError(error => throwError(error))
          )
        );
      }

      if (datosGenerales.categoriaTercero !== '3') {
        const datosRepre = this.DatosRepresentantes.obtenerDatosFormulario(true);
        requests.push(
          this.serviciocliente.guardarRepresentantesLegales(this.IdFormulario, datosRepre).pipe(
            catchError(error => throwError(error))
          )
        );

        const datosJunta = this.DatosJuntaDirectiva.obtenerDatosFormulario(true);
        requests.push(
          this.serviciocliente.guardarJuntaDirectiva(this.IdFormulario, datosJunta).pipe(
            catchError(error => throwError(error))
          )
        );

        const datosAccion = this.DatosAccionistas.obtenerDatosFormulario(true);
        requests.push(
          this.serviciocliente.guardarAccionistas(this.IdFormulario, datosAccion).pipe(
            catchError(error => throwError(error))
          )
        );
      }

      if (datosGenerales.pais === '43') {
        const infoTrib = this.componenteInformacionTriburaria.obtenerDatosFormulario(true);
        requests.push(
          this.serviciocliente.GuardarInformacionTriburaria({ ...infoTrib, IdFormulario: this.IdFormulario }).pipe(
            catchError(error => throwError(error))
          )
        );
      }

      const datosContacto = this.componenteDatosContacto.obtenerDatosFormulario(true);
      if (datosContacto.contactos?.length > 0) {
        requests.push(
          this.serviciocliente.guardarContactos(datosContacto.contactos).pipe(
            catchError(error => throwError(error))
          )
        );
      }

      const datosRef = this.componenteReferenciasComBn.obtenerDatosFormulario(true);
      if (datosRef.ReferenciaFinanciera?.length > 0) {
        requests.push(
          this.serviciocliente.guardarReferencias(datosRef.ReferenciaFinanciera).pipe(
            catchError(error => throwError(error))
          )
        );
      }

      // Solo guardar datos de pago si la pestaña debe mostrarse (no para Aliados)
      if (this.mostrarTabDatosdepagos) {
        const datosPago = this.DatosDePagos.obtenerDatosFormulario(true);
        requests.push(
          this.serviciocliente.GuardarDatoPgado({ ...datosPago, IdFormulario: this.IdFormulario }).pipe(
            catchError(error => throwError(error))
          )
        );
      }


      if (this.InformacionFinancieraComponent && this.mostrarTabInfoFinanciera) {
        const datosInfoFinanciera = this.InformacionFinancieraComponent.obtenerDatosFormulario(true);
        requests.push(
          this.serviciocliente.GuardaInformacionFinanciera({ ...datosInfoFinanciera, IdFormulario: this.IdFormulario }).pipe(
            catchError(error => throwError(error))
          )
        );
      }


      if (this.DatosRevisorFiscalComponent && this.mostrarTabDatosRevisorFiscal) {
        const datosRevisorFiscal = this.DatosRevisorFiscalComponent.obtenerDatosFormulario(true);
        requests.push(
          this.serviciocliente.GuardaDatosRevisorFiscal({ ...datosRevisorFiscal, IdFormulario: this.IdFormulario }).pipe(
            catchError(error => throwError(error))
          )
        );
      }


      if (this.InformacionComplementariaComponent && this.mostrarTabInformacionComplementaria) {
        const datosInfoComplementaria = this.InformacionComplementariaComponent.obtenerDatosFormulario(true);
        requests.push(
          this.serviciocliente.GuardarInformacionComplementaria({ ...datosInfoComplementaria, IdFormulario: this.IdFormulario }).pipe(
            catchError(error => throwError(error))
          )
        );
      }


      if (this.ConflictoInteresComponent && this.mostrarTabConflictoInteres) {
        const datosConflictoInteres = this.ConflictoInteresComponent.obtenerDatosFormulario(true);
        requests.push(
          this.serviciocliente.GuardarConflictoIntereses({ ...datosConflictoInteres, IdFormulario: this.IdFormulario }).pipe(
            catchError(error => throwError(error))
          )
        );
      }

      const datosCumpl = this.CumplimientoNormativo.obtenerDatosFormulario(true);
      requests.push(
        this.serviciocliente.GuardarCumplimientoNor({ ...datosCumpl, IdFormulario: this.IdFormulario }).pipe(
          catchError(error => throwError(error))
        )
      );

      const datosDecl = this.Declaraciones.obtenerDatosFormulario(true);
      requests.push(
        this.serviciocliente.GuardarDeclaraciones({ ...datosDecl, IdFormulario: this.IdFormulario }).pipe(
          catchError(error => throwError(error))
        )
      );

      //change estado a 3 => "Enviado"
      requests.push(
        this.serviciocliente.CambiarEstado(this.IdFormulario, 3).pipe(
          catchError(error => throwError(error))
        )
      );

      forkJoin(requests).subscribe({
        next: async (respuestas) => {

          // 1) Calcula y consulta el riesgo
          this.serviciocliente.CalcularRiesgoFormulario(this.IdFormulario).pipe(
            switchMap(() => this.serviciocliente.ObtenerRiesgoFormulario(this.IdFormulario))
          ).subscribe({
            next: (riesgo: any) => {
              this.setRiesgoData(riesgo);

              setTimeout(() => {
                this.router.navigate(['/pages/dash/ListaFormulariosUsuario']);
              }, 3000);
            },
            error: (err) => {
              console.error('Error calculando/consultando riesgo:', err);
            }
          });


          this.hideLoadingModal();


          //  await this.generarPDFEnvio3(datosGenerales);


          const modalRef = this.modalService.open(AlertModalComponent);
          modalRef.componentInstance.name = 'Formulario enviado con éxito!';
          modalRef.componentInstance.title = 'Éxito';


        },
        error: (err) => {
          this.hideLoadingModal();
          console.error('[Enviar] Error en forkJoin:', err);
          this.manejarError(err);
        },
        complete: () => {
          console.log('Todas las peticiones completaron');
        }
      });

    } catch (error) {
      this.hideLoadingModal();
      console.error('[Enviar] Excepción no controlada:', error);
      const modalRef = this.modalService.open(AlertModalComponent);
      modalRef.componentInstance.name = 'Error al procesar el envío: ' + ((error as any)?.message || JSON.stringify(error));
      modalRef.componentInstance.title = 'Error';
      modalRef.componentInstance.isError = true;
    }
  }
  submit() {
    const debeValidar = this.esFormularioExistente();

    if (debeValidar) {
      if (!this.validarTodosLosComponentes()) {
        return;
      }
    } else {

      this.componenteDatosGenerales.removeValidators();
      this.DespachoDeMercancia?.removeValidators();
      this.DatosRepresentantes?.removeValidators();
      this.DatosJuntaDirectiva?.removeValidators();
      this.DatosAccionistas?.removeValidators();
      this.componenteInformacionTriburaria?.removeValidators();
      this.componenteDatosContacto?.removeValidators();
      this.componenteReferenciasComBn?.removeValidators();
      this.DatosDePagos?.removeValidators();
      this.CumplimientoNormativo?.removeValidators();
      this.Declaraciones?.removeValidators();
      this.ConflictoInteresComponent?.removeValidators();
      this.InformacionComplementariaComponent?.removeValidators();
      this.InformacionFinancieraComponent?.removeValidators();
      this.DatosRevisorFiscalComponent?.removeValidators();
      this.DatosAduntos?.removeValidators();
    }

    const datosGenerales = this.componenteDatosGenerales.obtenerDatosFormulario(false);
    const DatosGenerarles: DatosGeneralesDto = {
      Id: datosGenerales.Id,
      IdFormulario: this.IdFormulario,
      FechaDiligenciamiento: this.FechaFormulario,
      Empresa: datosGenerales.empresa,
      TipoSolicitud: datosGenerales.tipoSolicitud,
      ClaseTercero: parseInt(datosGenerales.claseTercero),
      CategoriaTercero: parseInt(datosGenerales.categoriaTercero),
      NombreRazonSocial: datosGenerales.nombreRazonSocial,
      TipoIdentificacion: datosGenerales.tipoIdentificacion,
      NumeroIdentificacion: datosGenerales.numeroIdentificacion,
      DigitoVerificacion: datosGenerales.digitoVerificacion,
      Pais: datosGenerales.pais,
      Ciudad: datosGenerales.Ciudad,
      TamanoTercero: datosGenerales.tamanoTercero,
      ActividadEconimoca: datosGenerales.ActividadEconomicatab1,
      DireccionPrincipal: datosGenerales.DireccionPrincipal,
      codigoPostal: datosGenerales.CodigoPostalTab1,
      CorreoElectronico: datosGenerales.CorreoElectronicoTab1,
      Telefono: datosGenerales.TelefornoTab1,
      ObligadoFE: datosGenerales.ObligadoFacturarElectronicatab1,
      EstadoCivil: datosGenerales.estadoCivil,
      ConyugeIdentificacion: datosGenerales.conyugeIdentificacion,
      TipoPago: datosGenerales.tipoPago,
      CertBASC: datosGenerales.basc,
      CertOEA: datosGenerales.oea,
      CertCTPAT: datosGenerales.ctpat,
      CertOtros: datosGenerales.otros,
      CertNinguno: datosGenerales.ninguno,
      CorreoElectronicoFE: datosGenerales.correoElectronicoFE,
      TieneSucursalesOtrosPaises: datosGenerales.TieneSucursalesOtrosPaisestab1,
      PaisesOtrasSucursales: datosGenerales.PaisesOtrasSucursalestab1,
      PreguntasAdicionales: datosGenerales.preguntasAdicionales,
    };

    let requests = [
      this.serviciocliente.GuardarDatosGnerales(DatosGenerarles).pipe(
        catchError(error => {
          this.manejarError(error);
          return [];
        })
      )
    ];

    if (DatosGenerarles.ClaseTercero === 1) {
      const despacho = this.DespachoDeMercancia.obtenerDatosFormulario(false);
      const FormDespacho = {
        ...despacho,
        IdFormulario: this.IdFormulario
      };

      requests.push(
        this.serviciocliente.GuardarDespachoMercancia(FormDespacho).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        )
      );
    }

    if (DatosGenerarles.CategoriaTercero !== 3) {
      const datosrepresentante = this.DatosRepresentantes.obtenerDatosFormulario(false);
      requests.push(
        this.serviciocliente.guardarRepresentantesLegales(this.IdFormulario, datosrepresentante).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        ),
        this.serviciocliente.guardarJuntaDirectiva(this.IdFormulario, this.DatosJuntaDirectiva.obtenerDatosFormulario(false)).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        ),
        this.serviciocliente.guardarAccionistas(this.IdFormulario, this.DatosAccionistas.obtenerDatosFormulario(false)).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        ),
        this.serviciocliente.GuardaDatosRevisorFiscal(this.DatosRevisorFiscalComponent.obtenerDatosFormulario(false)).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          }
          )
        )
      );
    }

    const datosContacto = this.componenteDatosContacto.obtenerDatosFormulario(false);
    if (datosContacto.contactos && datosContacto.contactos.length > 0) {
      requests.push(
        this.serviciocliente.guardarContactos(datosContacto.contactos.map((contacto: any) => ({
          ...contacto
        }))).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        )
      );
    }

    const datosReferecias = this.componenteReferenciasComBn.obtenerDatosFormulario(false);
    if (datosReferecias.ReferenciaFinanciera && datosReferecias.ReferenciaFinanciera.length > 0) {
      requests.push(
        this.serviciocliente.guardarReferencias(datosReferecias.ReferenciaFinanciera.map((referencia: any) => ({
          ...referencia
        }))).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        )
      );
    }

    // Solo guardar datos de pago si la pestaña debe mostrarse (no para Aliados)
    if (this.mostrarTabDatosdepagos) {
      const datosPgo = this.DatosDePagos.obtenerDatosFormulario(false);
      const Formdatospago = {
        ...datosPgo,
        IdFormulario: this.IdFormulario
      };
      requests.push(
        this.serviciocliente.GuardarDatoPgado(Formdatospago).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        )
      );
    }

    const CumplimientoNor = this.CumplimientoNormativo.obtenerDatosFormulario(false);
    const FormCumplimiento = {
      ...CumplimientoNor,
      IdFormulario: this.IdFormulario
    };
    requests.push(
      this.serviciocliente.GuardarCumplimientoNor(FormCumplimiento).pipe(
        catchError(error => {
          this.manejarError(error);
          return [];
        })
      )
    );

    const infoTributaria = this.componenteInformacionTriburaria.obtenerDatosFormulario(false);
    const Forminfotribu = {
      ...infoTributaria,
      IdFormulario: this.IdFormulario
    };

    requests.push(
      this.serviciocliente.GuardarInformacionTriburaria(Forminfotribu).pipe(
        catchError(error => {
          this.manejarError(error);
          return [];
        })
      )
    );

    forkJoin(requests).subscribe(results => {
      const modalRef = this.modalService.open(AlertModalComponent);

      if (debeValidar) {
        modalRef.componentInstance.name = 'Formulario actualizado correctamente. Todos los campos han sido validados.';
      } else {
        modalRef.componentInstance.name = 'Formulario guardado correctamente como borrador.';
      }

      modalRef.componentInstance.title = 'Éxito';
    });
  }

  private manejarError(error: any): void {
    // Aquí manejas los errores y puedes guardarlos en una variable
    console.error('Error al guardar:', error);
    const modalRef = this.modalService.open(AlertModalComponent);
    modalRef.componentInstance.name = 'Error al guardar: ' + error.message;
    modalRef.componentInstance.title = 'Error';
    modalRef.componentInstance.isError = true;
  }

  seleccionarTab(tabId: string) {
    const tabLink = this.tabContainer.nativeElement.querySelector(`#${tabId}`);

    if (tabLink) {
      // Remove 'active' class from all tabs
      const tabs = this.tabContainer.nativeElement.querySelectorAll('.nav-link');
      tabs.forEach((tab: any) => this.renderer.removeClass(tab, 'active'));

      // Add 'active' class to the selected tab
      this.renderer.addClass(tabLink, 'active');

      // Show the selected tab content
      const tabContent = this.tabContainer.nativeElement.querySelector(tabLink.getAttribute('data-bs-target'));
      const allTabContents = this.tabContainer.nativeElement.querySelectorAll('.tab-pane');
      allTabContents.forEach((content: any) => this.renderer.removeClass(content, 'show'));
      allTabContents.forEach((content: any) => this.renderer.removeClass(content, 'active'));

      this.renderer.addClass(tabContent, 'show');
      this.renderer.addClass(tabContent, 'active');
    }
  }

  seleccionarTab2(tabId: string): void {
    const tabLink = this.tabContainer.nativeElement.querySelector(`#${tabId}`);

    if (tabLink) {
      // Create a new Tab instance and show the tab
      const tab = new bootstrap.Tab(tabLink);
      tab.show();
    }
  }



  private generateCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
    return html2canvas(element, {
      scale: 1,  // Reducir la escala para menor resolución
      logging: true,  // Habilitar logging para depuración
      useCORS: true,
      scrollY: -window.scrollY
    }).then(canvas => {
      return canvas;
    });
  }





  generarPDFrepresentantes(): void {
    const a4Container = document.getElementById('Representantespdf');  // Obtener el div que quieres convertir a PDF

    if (a4Container) {
      html2canvas(a4Container, {
        scale: 1,  // Resolución más baja para reducir tamaño del archivo
        logging: false,  // Desactivar logging
        useCORS: true  // Para imágenes externas que se puedan cargar
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 0.5);  // Usar calidad 0.5 para reducir tamaño

        const pdf = new jsPDF('p', 'mm', 'a4');
        const margin = 10;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'JPEG', margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
        pdf.save('documento_a4.pdf');
      });
    }
  }


  public generarPDFDatosGenerales(): void {
    this.isLoading = true;
    const a4Container = document.getElementById('DatosGeneralespdf');  // Obtener el div que quieres convertir a PDF

    if (a4Container) {
      // Usar html2canvas para convertir el div a imagen
      html2canvas(a4Container, {
        scale: 1,  // Resolución más baja para reducir tamaño del archivo
        logging: false,  // Desactivar logging
        useCORS: true  // Para imágenes externas que se puedan cargar
      }).then(canvas => {
        // Convertir el canvas a imagen en formato JPEG
        const imgData = canvas.toDataURL('image/jpeg', 0.5);  // Usar calidad 0.5 para reducir tamaño

        const pdf = new jsPDF('p', 'mm', 'a4');

        // Establecer márgenes
        const margin = 10;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Añadir la imagen al PDF
        pdf.addImage(imgData, 'JPEG', margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

        // Guardar el PDF con un nombre
        pdf.save('datos_generales.pdf');

        this.isLoading = false;  // Asegurarse de que el spinner desaparezca después de completar la operación
      }).catch(error => {
        console.error('Error al generar PDF:', error);
        this.isLoading = false;  // Asegurarse de que el spinner desaparezca incluso si ocurre un error
      });
    } else {
      console.error('No se encontró el div de datos generales.');
      this.isLoading = false;  // Asegurarse de que el spinner desaparezca si no se encuentra el `div`
    }
  }


  public async DesabilitaFormuarioscambiaEstado(): Promise<void> {

    this.componenteDatosGenerales.Desabilitacamposdespuesdeenvio();
    this.DatosRepresentantes.IdEstadoFormulario = 3;

    this.DatosRepresentantes.Desabilitacamposdespuesdeenvio();
    this.DatosRepresentantes.IdEstadoFormulario = 3;

    this.DatosJuntaDirectiva.Desabilitacamposdespuesdeenvio();
    this.DatosJuntaDirectiva.IdEstadoFormulario = 3;

    this.DatosAccionistas.Desabilitacamposdespuesdeenvio()
    this.DatosAccionistas.IdEstadoFormulario = 3;

    this.componenteDatosContacto.Desabilitacamposdespuesdeenvio();
    this.componenteDatosContacto.IdEstadoFormulario = 3;

    this.componenteReferenciasComBn.Desabilitacamposdespuesdeenvio();
    this.componenteReferenciasComBn.IdEstadoFormulario = 3;

    this.DatosDePagos.Desabilitacamposdespuesdeenvio();
    this.DatosDePagos.IdEstadoFormulario = 3;

    this.DespachoDeMercancia.Desabilitacamposdespuesdeenvio();
    this.DespachoDeMercancia.IdEstadoFormulario = 3;

    this.CumplimientoNormativo.Desabilitacamposdespuesdeenvio();
    this.DespachoDeMercancia.IdEstadoFormulario = 3;

    this.DatosAduntos.IdEstadoFormulario = 3;




    //this.seleccionarTab2('DatosGenerales-tab');
    //const canvasDatosGenerales = await this.generateCanvas(this.componenteDatosGenerales.ObtenerDivFormulario());

  }




  private seleccionarTab3(tabId: string): void {
    const tab = this.tabContainer.nativeElement.querySelector(`#${tabId}`);
    if (tab) {
      tab.click();
    }
  }


  private concatenateCanvases(canvases: HTMLCanvasElement[]): HTMLCanvasElement {
    const totalHeight = canvases.reduce((sum, canvas) => sum + canvas.height, 0);
    const maxWidth = Math.max(...canvases.map(canvas => canvas.width));

    const concatenatedCanvas = document.createElement('canvas');
    concatenatedCanvas.width = maxWidth;
    concatenatedCanvas.height = totalHeight;

    const ctx = concatenatedCanvas.getContext('2d');
    let y = 0;
    canvases.forEach(canvas => {
      ctx?.drawImage(canvas, 0, y);
      y += canvas.height;
    });

    return concatenatedCanvas;
  }



  private async generateImageData(element: HTMLElement): Promise<string> {
    if (!element || element.clientHeight === 0 || element.clientWidth === 0) {
      console.error('El div tiene dimensiones nulas o no está visible:', element);
      throw new Error('El div tiene dimensiones nulas o no está visible');
    }

    return new Promise((resolve, reject) => {
      html2canvas(element, {
        scale: 1,
        logging: true,  // Habilitar logging para depuración
        useCORS: true,
        scrollY: -window.scrollY
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 0.5);  // Usar calidad 0.5 para reducir tamaño del archivo
        if (imgData) {
          resolve(imgData);
        } else {
          reject(new Error('Failed to generate image data'));
        }
      }).catch(error => {
        console.error('Error en html2canvas:', error);
        reject(error);
      });
    });
  }

  private createMultiPagePdf(images: string[]): void {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let y = margin;

    images.forEach((imgData, index) => {
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      // Si la imagen no cabe en la página actual, añadir una nueva página
      if (y + imgHeight + margin > pageHeight) {
        pdf.addPage();
        y = margin; // Resetear el margen superior
      }

      pdf.addImage(imgData, 'JPEG', margin, y, pageWidth - 2 * margin, imgHeight);
      y += imgHeight + margin;
    });

    // Guardar el PDF con un nombre
    pdf.save('documento_combined.pdf');
  }


  private createPdf(imgData: string): void {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    pdf.addImage(imgData, 'JPEG', margin, margin, pageWidth - 2 * margin, imgHeight);

    // Guardar el PDF con un nombre
    pdf.save('documento_combined.pdf');
  }
  private createSinglePagePdf(imgData: string): void {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    // Ajustar la altura de la página del PDF según la altura de la imagen
    pdf.internal.pageSize.height = imgHeight + 2 * margin;

    pdf.addImage(imgData, 'JPEG', margin, margin, pageWidth - 2 * margin, imgHeight);

    // Guardar el PDF con un nombre
    pdf.save('documento_single_page.pdf');
  }


  showLoadingModal() {
    const myModalEl = document.getElementById('loadingModal');
    if (myModalEl) {
      const myModal = new bootstrap.Modal(myModalEl, {
        keyboard: false
      });
      myModal.show();
    } else {
      console.error('No se encontró el elemento del modal para mostrarlo');
    }
  }

  hideLoadingModal() {
    this.isLoading = false;
    const myModalEl = document.getElementById('loadingModal');
    if (myModalEl) {
      let modal = bootstrap.Modal.getInstance(myModalEl);
      if (!modal) {
        modal = new bootstrap.Modal(myModalEl);
      }
      modal.hide();
      setTimeout(() => {
        if (!this.modalService.hasOpenModals()) {
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
        }
      }, 500);
    } else {
      console.error('No se encontró el elemento del modal para ocultarlo');
    }
  }



  async downloadfile() {

    this.serviciocliente.descargarArchivo('PDFEnviado', this.IdFormulario).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "FormularioPdf.pdf";  // Puedes cambiar esto para usar el nombre del archivo real
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }, error => {
      console.error('Error al descargar el archivo:', error);
    });

  }


  createTempContainer(): HTMLElement {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.zIndex = '-1';
    document.body.appendChild(container);
    return container;
  }


  RechazarForm(): void {
    const modalRef = this.modalService.open(RechazoModalComponent, {
      centered: true,
      windowClass: 'custom-modal-width'
    });
    modalRef.componentInstance.formularioId = this.IdFormulario;
    modalRef.componentInstance.isReadOnly = false;

    modalRef.result.then((result) => {
      if (result) {


        const motivoRechazo: MotivoRechazo = {
          IdFormulario: this.IdFormulario,
          MotivoRechazo: result.motivo,
          FechaRechazo: ''

        }

        this.serviciocliente.RechazarFomulario(motivoRechazo).subscribe((response) => {
          this.isLoading = false;
          const modalRef = this.modalService.open(AlertModalComponent);
          modalRef.componentInstance.name = 'Registro Creado Correctamente!';
          modalRef.componentInstance.title = '!';

          this.router.navigate(['/pages/dash/ListaFormulariosUsuario']);
          // Aquí podrías manejar la respuesta del servidor si es necesario
        },
          (error) => {
            this.isLoading = false;
            const modalRef = this.modalService.open(AlertModalComponent);
            modalRef.componentInstance.name = 'Error al crear Registro!\n'
              + error.error;
            modalRef.componentInstance.title = 'Error';
            modalRef.componentInstance.isError = true;

          });

      }
    }, (reason) => {
    });
  }

  async AceptaContabildad() {
    this.showLoadingModal();
    await new Promise(resolve => setTimeout(resolve, 500));

    this.serviciocliente.CambiarEstado(this.IdFormulario, 5).subscribe((response) => {
      this.isLoading = false;
      this.hideLoadingModal();
      const modalRef = this.modalService.open(AlertModalComponent);
      modalRef.componentInstance.name = 'Informacion Guardada!';
      modalRef.componentInstance.title = '!';
      this.hideLoadingModal();

      document.body.style.overflow = 'visible';
      this.router.navigate(['/pages/dash/ListaFormulariosUsuario']);
      modalRef.result.then(() => location.reload())
        .catch(() => location.reload());
      // Aquí podrías manejar la respuesta del servidor si es necesario
    },
      (error) => {
        this.isLoading = false;
        this.hideLoadingModal();
        document.body.style.overflow = 'visible';
        const modalRef = this.modalService.open(AlertModalComponent);
        modalRef.componentInstance.name = 'Error al crear Registro!\n'
          + error.error;
        modalRef.componentInstance.title = 'Error';
        modalRef.componentInstance.isError = true;
      });

  }


  async AceptaControlInterno() {
    this.showLoadingModal();
    await new Promise(resolve => setTimeout(resolve, 500));
    this.serviciocliente.AceptaFormualio(this.IdFormulario, 5).subscribe((response) => {
      this.isLoading = false;
      const modalRef = this.modalService.open(AlertModalComponent);
      modalRef.componentInstance.name = 'Informacion Guardada!';
      modalRef.componentInstance.title = '!';
      this.hideLoadingModal();
      document.body.style.overflow = 'visible';
      this.router.navigate(['/pages/dash/ListaFormulariosUsuario']);
      modalRef.result.then(() => location.reload())
        .catch(() => location.reload());
      // Aquí podrías manejar la respuesta del servidor si es necesario
    },
      (error) => {
        this.isLoading = false;
        this.hideLoadingModal();
        document.body.style.overflow = 'visible';
        const modalRef = this.modalService.open(AlertModalComponent);
        modalRef.componentInstance.name = 'Error al crear Registro!\n'
          + error.error;
        modalRef.componentInstance.title = 'Error';
        modalRef.componentInstance.isError = true;
      });

  }


  RechazarControlInterno(): void {
    const modalRef = this.modalService.open(RechazoModalComponent, {
      centered: true,
      windowClass: 'custom-modal-width'
    });
    modalRef.componentInstance.formularioId = this.IdFormulario;
    modalRef.componentInstance.isReadOnly = false;

    modalRef.result.then((result) => {
      if (result) {
        const motivoRechazo: MotivoRechazo = {
          IdFormulario: this.IdFormulario,
          MotivoRechazo: result.motivo,
          FechaRechazo: ''
        }

        this.serviciocliente.RechazarFomulario(motivoRechazo).subscribe((response) => {
          this.isLoading = false;
          const modalRef = this.modalService.open(AlertModalComponent);
          modalRef.componentInstance.name = 'Registro Creado Correctamente!';
          modalRef.componentInstance.title = '!';

          this.router.navigate(['/pages/dash/ListaFormulariosUsuario']);
          // Aquí podrías manejar la respuesta del servidor si es necesario
        },
          (error) => {
            this.isLoading = false;
            const modalRef = this.modalService.open(AlertModalComponent);
            modalRef.componentInstance.name = 'Error al crear Registro!\n'
              + error.error;
            modalRef.componentInstance.title = 'Error';
            modalRef.componentInstance.isError = true;

          });
      }
    }, (reason) => {
    });
  }

  aplicarVisibilidadTabsSegunEstadoYRol(): void {
    if (this.IdEstadoFormulario === 3) {

      if (this.tipousuario && ['Contabilidad', 'Control Interno', 'Oficial de Cumplimiento'].includes(this.tipousuario)) {


        this.mostrarTabDatosRevisorFiscal = false;
        this.mostrarTabInfoFinanciera = false;
        this.mostrarTabInformacionComplementaria = false;
        if (!this.classAliado) {
          this.mostrarTabConflictoInteres = false;
        }
        this.mostrarTabReferenciasBancarias = true;
      }
    }
  }

  private esFormularioExistente(): boolean {

    return !!(this.IdFormulario && this.IdFormulario > 0);
  }


  private validarTodosLosComponentes(): boolean {
    const camposFaltantes: any[] = [];
    let componenteConError = '';
    let tabIdConError = '';

    const datosGenerales = this.componenteDatosGenerales?.obtenerDatosFormulario(false);
    try {
      if (this.debeValidarComponente('DatosGenerales')) {
        if (!this.componenteDatosGenerales?.esFormularioValido()) {
          const camposInvalidos = this.componenteDatosGenerales?.obtenerCamposInvalidos?.() || [];
          if (camposInvalidos.length > 0) {
            camposFaltantes.push(...camposInvalidos);
            componenteConError = 'Datos Generales';
            tabIdConError = 'DatosGenerales-tab';
          }
        }
      }


      if (this.debeValidarComponente('DespachoDeMercancia')) {
        if (!this.DespachoDeMercancia.esFormularioValido?.()) {
          const camposInvalidos = this.DespachoDeMercancia?.obtenerCamposInvalidos?.() || [];
          if (camposInvalidos.length > 0) {
            camposFaltantes.push(...camposInvalidos);
            componenteConError = 'Despacho de Mercancía';
            tabIdConError = 'DespachoDeMercancia-tab';
          }
        }
      }
      if (this.debeValidarComponente('RepresentantesLegales')) {
        if (this.DatosRepresentantes?.esFormularioValido) {
          const esValido = this.DatosRepresentantes.esFormularioValido();

          if (!esValido) {
            const camposInvalidos = this.DatosRepresentantes?.obtenerCamposInvalidos?.() || [];

            if (camposInvalidos.length > 0) {

              const camposProcesados = this.procesarCamposRepresentanteLegal(camposInvalidos);

              camposFaltantes.push(...camposProcesados);
              componenteConError = 'Representantes Legales';
              tabIdConError = 'RepresentanteLegal-tab';
            }
          }
        }
      }

      if (this.debeValidarComponente('JuntaDirectiva')) {
        if (!this.DatosJuntaDirectiva.esFormularioValido?.()) {
          const camposInvalidos = this.DatosJuntaDirectiva?.obtenerCamposInvalidos?.() || [];
          if (camposInvalidos.length > 0) {
            camposFaltantes.push(...camposInvalidos);
            componenteConError = 'Junta Directiva';
            tabIdConError = 'JuntaDirectiva-tab';
          }
        }
      }

      if (this.debeValidarComponente('Accionistas')) {
        if (!this.DatosAccionistas.esFormularioValido?.()) {
          const camposInvalidos = this.DatosAccionistas?.obtenerCamposInvalidos?.() || [];
          if (camposInvalidos.length > 0) {
            camposFaltantes.push(...camposInvalidos);
            componenteConError = 'Accionistas';
            tabIdConError = 'Accionistas-tab';
          }
        }
      }

      if (this.debeValidarComponente('DatosRevisorFiscal')) {
        if (this.DatosRevisorFiscalComponent.esFormularioValido && !this.DatosRevisorFiscalComponent.esFormularioValido()) {
          const camposInvalidos = (this.DatosRevisorFiscalComponent as any)?.obtenerCamposInvalidos?.() || ['Revisor Fiscal - Campos requeridos'];
          camposFaltantes.push(...camposInvalidos);
          componenteConError = 'Datos Revisor Fiscal';
          tabIdConError = 'DatosRevisorFiscal-tab';
        }
      }

      if (this.debeValidarComponente('InformacionTributaria')) {
        if (!this.componenteInformacionTriburaria.esFormularioValido?.()) {
          const camposInvalidos = this.componenteInformacionTriburaria?.obtenerCamposInvalidos?.() || [];
          if (camposInvalidos.length > 0) {
            camposFaltantes.push(...camposInvalidos);
            componenteConError = 'Información Tributaria';
            tabIdConError = 'InformacionTributaria-tab';
          }
        }
      }

      if (this.debeValidarComponente('DatosContacto')) {
        if (!this.componenteDatosContacto.esFormularioValido?.()) {
          const camposInvalidos = this.componenteDatosContacto?.obtenerCamposInvalidos?.() || [];
          if (camposInvalidos.length > 0) {
            camposFaltantes.push(...camposInvalidos);
            componenteConError = 'Datos de Contacto';
            tabIdConError = 'DatosContacto-tab';
          }
        }
      }


      if (this.debeValidarComponente('ReferenciasBancarias')) {
        if (!this.componenteReferenciasComBn.esFormularioValido?.()) {
          const camposInvalidos = this.componenteReferenciasComBn?.obtenerCamposInvalidos?.() || [];
          if (camposInvalidos.length > 0) {
            camposFaltantes.push(...camposInvalidos);
            componenteConError = 'Referencias Comerciales Bancarias';
            tabIdConError = 'ReferenciasComercialesBancarias-tab';
          }
        }
      }

      if (this.debeValidarComponente('DatosPago')) {
        if (!this.DatosDePagos.esFormularioValido?.()) {
          const camposInvalidos = this.DatosDePagos?.obtenerCamposInvalidos?.() || [];
          if (camposInvalidos.length > 0) {
            camposFaltantes.push(...camposInvalidos);
            componenteConError = 'Datos de Pago';
            tabIdConError = 'Datosdepagos-tab';
          }
        }
      }

      if (this.debeValidarComponente('InformacionFinanciera')) {
        try {
          const component = this.InformacionFinancieraComponent as any;
          if (component.esFormularioValido && !component.esFormularioValido()) {
            camposFaltantes.push('Información Financiera - Campos requeridos');
            componenteConError = 'Información Financiera';
            tabIdConError = 'InformacionFinanciera-tab';
          }
        } catch (e) {

        }
      }

      if (this.debeValidarComponente('InformacionComplementaria')) {
        try {
          const component = this.InformacionComplementariaComponent as any;
          if (component.esFormularioValido && !component.esFormularioValido()) {
            camposFaltantes.push('Información Complementaria - Campos requeridos');
            componenteConError = 'Información Complementaria';
            tabIdConError = 'InformacionComplementaria-tab';
          }
        } catch (e) {

        }
      }

      if (this.debeValidarComponente('ConflictoInteres')) {
        try {
          const component = this.ConflictoInteresComponent as any;
          if (component.esFormularioValido && !component.esFormularioValido()) {
            camposFaltantes.push('Conflicto de Interés - Campos requeridos');
            componenteConError = 'Conflicto de Interés';
            tabIdConError = 'ConflictoInteres-tab';
          }
        } catch (e) {

        }
      }


      if (this.debeValidarComponente('CumplimientoNormativo')) {
        if (!this.CumplimientoNormativo.esFormularioValido?.()) {
          const camposInvalidos = this.CumplimientoNormativo?.obtenerCamposInvalidos?.() || [];
          if (camposInvalidos.length > 0) {
            camposFaltantes.push(...camposInvalidos);
            componenteConError = 'Cumplimiento Normativo';
            tabIdConError = 'CumplimientoNormativo-tab';
          }
        }
      }

      if (this.debeValidarComponente('DatosAdjuntos')) {
        if (!this.DatosAduntos.esFormularioValido?.()) {
          const camposInvalidos = this.DatosAduntos?.obtenerCamposInvalidos?.() || [];
          if (camposInvalidos.length > 0) {
            camposFaltantes.push(...camposInvalidos);
            componenteConError = 'Datos Adjuntos';
            tabIdConError = 'Adjuntos-tab';
          }
        }
      }

      if (this.debeValidarComponente('Declaraciones')) {
        if (!this.Declaraciones.esFormularioValido?.()) {
          const camposInvalidos = this.Declaraciones?.obtenerCamposInvalidos?.() || [];
          if (camposInvalidos.length > 0) {
            camposFaltantes.push(...camposInvalidos);
            componenteConError = 'Declaraciones';
            tabIdConError = 'Declaraciones-tab';
          }
        }
      }


      if (camposFaltantes.length > 0) {
        this.mostrarModalCamposFaltantes(componenteConError, camposFaltantes, tabIdConError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error al validar componentes:', error);
      const modalRef = this.modalService.open(AlertModalComponent);
      modalRef.componentInstance.name = 'Error al validar el formulario. Por favor, revise todos los campos e intente nuevamente.';
      modalRef.componentInstance.title = 'Error de Validación';
      modalRef.componentInstance.isError = true;
      return false;
    }
  }

  private debeValidarComponente(tipoComponente: string): boolean {
    const datosGenerales = this.componenteDatosGenerales?.obtenerDatosFormulario(false);

    switch (tipoComponente) {
      case 'DatosGenerales':
        return true;

      case 'DespachoDeMercancia':
        return this.mostrarTabDespachos && !!this.DespachoDeMercancia;

      case 'RepresentantesLegales':
        const categoriaEsPersonaJuridica = datosGenerales?.categoriaTercero !== '3' && datosGenerales?.categoriaTercero !== 3;
        const debeValidar = this.mostrarTabRepresentanteLegal && !!this.DatosRepresentantes && categoriaEsPersonaJuridica;


        return debeValidar; case 'JuntaDirectiva':

        const categoriaEsPersonaJuridica3 = datosGenerales?.categoriaTercero !== '3' && datosGenerales?.categoriaTercero !== 3;
        return this.mostrarTabAccionistas && categoriaEsPersonaJuridica3 && !!this.DatosJuntaDirectiva;

      case 'Accionistas':

        const categoriaEsPersonaJuridica4 = datosGenerales?.categoriaTercero !== '3' && datosGenerales?.categoriaTercero !== 3;
        return this.mostrarTabAccionistas && categoriaEsPersonaJuridica4 && !!this.DatosAccionistas;

      case 'DatosRevisorFiscal':

        const esPersonaJuridicaRevisor = datosGenerales?.categoriaTercero !== '3' && datosGenerales?.categoriaTercero !== 3;
        return this.mostrarTabDatosRevisorFiscal && esPersonaJuridicaRevisor && !!this.DatosRevisorFiscalComponent;

      case 'InformacionTributaria':
        const esColombia = datosGenerales?.pais === '43' || datosGenerales?.pais === 43;
        return this.mostrarTabInformacionTriburaria && esColombia && !!this.componenteInformacionTriburaria;

      case 'DatosContacto':
        return this.mostrarTabDatosdeContacto && !!this.componenteDatosContacto;

      case 'ReferenciasBancarias':
        return this.mostrarTabReferenciasBancarias && !!this.componenteReferenciasComBn;

      case 'DatosPago':
        const noEsAliado = !this.claseTerceroIsAliado;
        return this.mostrarTabDatosdepagos && noEsAliado && !!this.DatosDePagos;

      case 'InformacionFinanciera':
        return this.mostrarTabInfoFinanciera && !!this.InformacionFinancieraComponent;

      case 'InformacionComplementaria':
        return this.mostrarTabInformacionComplementaria && !!this.InformacionComplementariaComponent;

      case 'ConflictoInteres':
        return this.mostrarTabConflictoInteres && !!this.ConflictoInteresComponent;

      case 'CumplimientoNormativo':
        return this.mostrarTabCumplimientoNormativo && !!this.CumplimientoNormativo;

      case 'DatosAdjuntos':
        return true;

      case 'Declaraciones':
        return this.mostrarTabDeclaraciones && !!this.Declaraciones;

      default:
        return false;
    }
  }

  private mostrarModalCamposFaltantes(seccion: string, campos: any[], tabId?: string): void {

    let camposProcesados: string[];

    if (seccion === 'Representantes Legales') {
      camposProcesados = this.procesarCamposRepresentanteLegal(campos);
    } else {
      const listaCampos = campos.map((c: any) => {
        if (typeof c === 'string') {
          return this.traducirNombreCampo(c);
        }

        let nombreCampo = '';
        if (c?.field) {
          nombreCampo = c.field;
        } else if (c?.control) {
          nombreCampo = c.control;
        } else if (c?.campo) {
          nombreCampo = c.campo;
        } else {
          const jsonStr = JSON.stringify(c);
          const fieldMatch = jsonStr.match(/"field":"([^"]+)"/);
          if (fieldMatch) {
            nombreCampo = fieldMatch[1];
          } else {
            nombreCampo = 'Campo requerido';
          }
        }

        return this.traducirNombreCampo(nombreCampo);
      });

      camposProcesados = listaCampos;
    }

    const camposUnicos = [...new Set(camposProcesados.filter(campo => campo && campo.trim() !== ''))];

    try {
      const modal = this.modalService.open(AlertModalComponent);
      modal.componentInstance.title = 'Campos faltantes';
      modal.componentInstance.name = `Para continuar con la edición, debe completar los siguientes campos en "${seccion}":\n\n• ${camposUnicos.join('\n• ')}`;
      modal.componentInstance.isError = true;


      this.marcarCamposComoTocados(seccion);

      if (tabId) {
        setTimeout(() => {
          this.seleccionarTab2(tabId);
        }, 500);
      }
    } catch (error) {
      console.error('Error al mostrar modal de campos faltantes:', error);
    }
  }

  private traducirNombreCampo(nombreTecnico: string): string {
    const traducciones: { [key: string]: string } = {

      'PaisesObligacionTributaria': 'Países con obligación tributaria',
      'PaisesCuentasExt': 'Países con cuentas en el exterior',
      'PaisesPoderCuentaExtranjera': 'Países con poder sobre cuentas extranjeras',
      'representanteIndex': 'Información del representante',

      'nombreCompleto': 'Nombre completo del representante',
      'tipoIdentificacion': 'Tipo de identificación',
      'numeroIdentificacion': 'Número de identificación',
      'nacionalidad': 'Nacionalidad',
      'direccion': 'Dirección',
      'telefono': 'Teléfono',
      'correoElectronico': 'Correo electrónico',
      'ciudad': 'Ciudad',
      'esPersonaPep': '¿Es persona PEP o vinculada con una de ellas?',


      'entidad': 'Entidad',
      'cargo': 'Cargo',
      'fechaInicio': 'Fecha de inicio',
      'fechaFin': 'Fecha de fin',

      'tipoVinculo': 'Tipo de vínculo',
      'nombrePersona': 'Nombre de la persona',
      'descripcionVinculo': 'Descripción del vínculo',


      'parentesco': 'Parentesco',
      'nombreFamiliar': 'Nombre del familiar',
      'cargoFamiliar': 'Cargo del familiar',


      'nombreRazonSocial': 'Nombre o Razón Social',
      'digitoVerificacion': 'Dígito de Verificación',
      'pais': 'País',
      'direccionPrincipal': 'Dirección Principal',
      'actividadEconomica': 'Actividad Económica',
      'tamanoTercero': 'Tamaño del Tercero',

      'nombreContacto': 'Nombre del Contacto',
      'cargoContacto': 'Cargo del Contacto',
      'telefonoContacto': 'Teléfono del Contacto',
      'correoContacto': 'Correo del Contacto',


      'regimenTributario': 'Régimen Tributario',
      'obligadoFacturarElectronicamente': 'Obligado a Facturar Electrónicamente',
      'autoretenedor': 'Autoretenedor',
      'granContribuyente': 'Gran Contribuyente',

      // Referencias Bancarias
      'entidadFinanciera': 'Entidad Financiera',
      'tipoCuenta': 'Tipo de Cuenta',
      'numeroCuenta': 'Número de Cuenta',
      'fechaApertura': 'Fecha de Apertura',

      // Datos de Pago
      'formaPago': 'Forma de Pago',
      'plazoCredito': 'Plazo de Crédito',
      'cupoCredito': 'Cupo de Crédito',

      // Accionistas
      'nombreAccionista': 'Nombre del Accionista',
      'tipoDocumentoAccionista': 'Tipo de Documento del Accionista',
      'numeroDocumentoAccionista': 'Número de Documento del Accionista',
      'porcentajeParticipacion': 'Porcentaje de Participación',

      // Junta Directiva
      'nombreMiembro': 'Nombre del Miembro',
      'cargoMiembro': 'Cargo del Miembro',
      'tipoDocumentoMiembro': 'Tipo de Documento del Miembro',
      'numeroDocumentoMiembro': 'Número de Documento del Miembro',

      // Revisor Fiscal
      'nombreRevisorFiscal': 'Nombre del Revisor Fiscal',
      'tipoDocumentoRevisor': 'Tipo de Documento del Revisor',
      'numeroDocumentoRevisor': 'Número de Documento del Revisor',
      'tarjetaProfesional': 'Tarjeta Profesional',

      // Adjuntos
      'certificadoExistencia': 'Certificado de Existencia y Representación Legal',
      'rut': 'RUT',
      'estadosFinancieros': 'Estados Financieros',
      'referenciaComercial': 'Referencia Comercial',

      'required': 'Campo requerido',
      'email': 'Formato de correo electrónico inválido',
      'minlength': 'Campo demasiado corto',
      'maxlength': 'Campo demasiado largo',
      'pattern': 'Formato inválido'
    };

    if (traducciones[nombreTecnico]) {
      return traducciones[nombreTecnico];
    }

    // Si contiene palabras clave, intentar crear una descripción más amigable
    if (nombreTecnico.toLowerCase().includes('required')) {
      return 'Campo requerido';
    }

    if (nombreTecnico.toLowerCase().includes('email')) {
      return 'Correo electrónico con formato válido';
    }

    if (nombreTecnico.toLowerCase().includes('phone') || nombreTecnico.toLowerCase().includes('telefono')) {
      return 'Número de teléfono';
    }

    if (nombreTecnico.toLowerCase().includes('nombre')) {
      return 'Nombre completo';
    }

    if (nombreTecnico.toLowerCase().includes('documento') || nombreTecnico.toLowerCase().includes('identificacion')) {
      return 'Documento de identificación';
    }


    return nombreTecnico
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private marcarCamposComoTocados(seccion: string): void {
    try {
      switch (seccion) {
        case 'Datos Generales':
          this.componenteDatosGenerales?.marcarFormularioComoTocado?.();
          break;
        case 'Despacho de Mercancía':
          this.DespachoDeMercancia?.marcarFormularioComoTocado?.();
          break;
        case 'Representantes Legales':
          this.DatosRepresentantes?.marcarFormularioComoTocado?.();
          break;
        case 'Junta Directiva':
          this.DatosJuntaDirectiva?.marcarFormularioComoTocado?.();
          break;
        case 'Accionistas':
          this.DatosAccionistas?.marcarFormularioComoTocado?.();
          break;
        case 'Información Tributaria':
          this.componenteInformacionTriburaria?.marcarFormularioComoTocado?.();
          break;
        case 'Datos de Contacto':
          this.componenteDatosContacto?.marcarFormularioComoTocado?.();
          break;
        case 'Referencias Comerciales Bancarias':
          break;
        case 'Datos de Pago':
          this.DatosDePagos?.marcarFormularioComoTocado?.();
          break;
        case 'Cumplimiento Normativo':
          this.CumplimientoNormativo?.marcarFormularioComoTocado?.();
          break;
        case 'Datos Adjuntos':
          this.DatosAduntos?.marcarFormularioComoTocado?.();
          break;
        case 'Declaraciones':
          this.Declaraciones?.marcarFormularioComoTocado?.();
          break;
      }
    } catch (error) {
      console.error(`Error al marcar campos como tocados en ${seccion}:`, error);
    }

    this.cdr.detectChanges();
  }

  private procesarCamposRepresentanteLegal(camposInvalidos: any[]): string[] {
    const camposProcesados: string[] = [];

    camposInvalidos.forEach((campo, index) => {
      let nombreAmigable = '';

      if (typeof campo === 'string') {
        nombreAmigable = this.traducirNombreCampo(campo);
      } else if (campo && typeof campo === 'object') {
        if (campo.field) {
          nombreAmigable = this.traducirNombreCampo(campo.field);

          if (campo.representanteIndex !== undefined && campo.representanteIndex >= 0) {
            nombreAmigable += ` (Representante ${campo.representanteIndex + 1})`;
          }
        } else if (campo.subField) {

          nombreAmigable = this.traducirNombreCampo(campo.subField);

          if (campo.subArray) {
            switch (campo.subArray) {
              case 'cargosPublicos':
                nombreAmigable += ' en Cargos Públicos';
                break;
              case 'Vinculosmas':
                nombreAmigable += ' en Vínculos';
                break;
              case 'InfoFamiliaPep':
                nombreAmigable += ' en Información Familiar PEP';
                break;
            }
          }

          if (campo.subIndex !== undefined) {
            nombreAmigable += ` (Item ${campo.subIndex + 1})`;
          }
        } else {
          const jsonStr = JSON.stringify(campo);

          let fieldName = '';

          if (campo.control) {
            fieldName = campo.control;
          } else if (campo.campo) {
            fieldName = campo.campo;
          } else {
            const fieldMatch = jsonStr.match(/"field":"([^"]+)"/);
            const controlMatch = jsonStr.match(/"control":"([^"]+)"/);
            if (fieldMatch) {
              fieldName = fieldMatch[1];
            } else if (controlMatch) {
              fieldName = controlMatch[1];
            } else {
              const keys = Object.keys(campo);
              fieldName = keys.find(key =>
                key !== 'errors' &&
                key !== 'valid' &&
                key !== 'invalid' &&
                key !== 'status'
              ) || 'Campo requerido';
            }
          }

          nombreAmigable = this.traducirNombreCampo(fieldName);
        }
      } else {
        nombreAmigable = 'Campo requerido en Representantes Legales';
      }

      if (nombreAmigable && nombreAmigable.trim() !== '') {
        camposProcesados.push(nombreAmigable);
      }
    });

    return camposProcesados;
  }

  // Verificar qué pestañas tienen datos reales guardados
  private verificarPestanasConDatos(): void {
    // Para formularios enviados (estado 3), verificar qué pestañas tienen datos reales
    // independientemente del rol que los consulte
    if (this.IdEstadoFormulario === 3) {


      if (!this.classAliado) {

        this.serviciocliente.ConsultaInformacionTributaria(this.IdFormulario).subscribe({
          next: (data) => {

            if (data && (data.id || Object.keys(data).length > 1)) {
              this.mostrarTabInformacionTriburaria = true;
            }
          },
          error: () => { }
        });


        this.serviciocliente.ConsultaDatosdepago(this.IdFormulario).subscribe({
          next: (data) => {
            if (data && (data.id || Object.keys(data).length > 1)) {
              this.mostrarTabDatosdepagos = true;
            }
          },
          error: () => { }
        });


        this.serviciocliente.ConsultaReferenciasFinancieras(this.IdFormulario).subscribe({
          next: (data) => {
            if (data && Array.isArray(data) && data.length > 0) {
              this.mostrarTabReferenciasBancarias = true;
            }
          },
          error: () => { }
        });


        this.serviciocliente.ConsultaInformacionFinanciera(this.IdFormulario).subscribe({
          next: (data) => {
            if (data && (data.id || Object.keys(data).length > 1)) {
              this.mostrarTabInfoFinanciera = true;
            }
          },
          error: () => { }
        });


        this.mostrarTabDatosRevisorFiscal = true;
        this.mostrarTabInformacionComplementaria = true;
        this.mostrarTabConflictoInteres = true;
      }
    }
  }

  getRiskBadgeClass(value: string | null | undefined): string {
    const level = this.extractRiskLevel(value);
    if (!level) {
      return 'bg-secondary text-white';
    }
    const normalized = level.toLowerCase();
    if (normalized === 'alto') {
      return 'bg-danger text-white';
    }
    if (normalized === 'medio') {
      return 'bg-warning text-dark';
    }
    if (normalized === 'bajo') {
      return 'bg-success text-white';
    }
    return 'bg-secondary text-white';
  }

  getRiskLevelLabel(value: string | null | undefined): string {
    return this.extractRiskLevel(value) ?? 'N/A';
  }

  private extractRiskLevel(value: string | null | undefined): string | null {
    if (!value) {
      return null;
    }
    const normalized = value.toLowerCase();
    if (normalized.includes('alto')) {
      return 'Alto';
    }
    if (normalized.includes('medio')) {
      return 'Medio';
    }
    if (normalized.includes('bajo')) {
      return 'Bajo';
    }
    return value.trim() || null;
  }

}
