import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../Services/main.services';
import { noSeleccionadoValidator } from '../utils/validcliente/validacionOpcionales';
import { IdentificacionValidators } from '../utils/identificacion-validators';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-representante-legal',
  templateUrl: './representante-legal.component.html',
  styleUrl: './representante-legal.component.scss'
})
export class RepresentanteLegalComponent implements OnInit {
  @ViewChild('childDivR', { static: true }) childDivR!: ElementRef;
  Lang: string = 'es';
  datos: any;
  @Input() IdEstadoFormulario: number;
  @Input() IdFormulario: number;
  @Input() Listatiposolicitud: any[];
  @Input() ListaClaseTerceros: any[];
  @Input() ListaTipoDocumentos: any[] = [];
  documentosFiltrados: any[] = [];
  @Input() ListaSino: any[];
  @Input() ListaPaises: any[];
  @Input() ListaTamanoterceros: any[];
  @Input() ListaActividadesEco: any[];
  @Input() ListaCategoriaTerceros: any[];
  @Input() editable: boolean;
  @Input() categoriaTercero: string | number;
  RepresentantesForm: FormGroup;
  isbolean: boolean = false;
  tabdespachos: boolean = true;
  tabdRepresentanteLegal: boolean = true;

  private originalValidators: { [key: string]: any } = {};
  private numericDocumentIds = [1, 2, 3];
  formulario: FormGroup;
  constructor(private fb: FormBuilder, private translate: TranslateService, private serviciocliente: ServicioPrincipalService, private cdr: ChangeDetectorRef) {
    this.translate.setDefaultLang('es');
    this.Lang = localStorage.getItem('language') || 'es';
    this.translate.use(this.Lang);
    this.RepresentantesForm = this.fb.group({

      representantes: this.fb.array([],)
    });
  }

  // Custom validator to enforce at least one representative for legal entities
  private minimumRepresentantesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const representantes = control as FormArray;
      // Check if categoriaTercero is 1 (Persona Jurídica) and ensure at least one representative
      if (this.categoriaTercero === '1' || this.categoriaTercero === 1) {
        return representantes.length > 0 ? null : { minimumRepresentantes: true };
      }
      return null; // No validation if not a legal entity
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoriaTercero']) {
      // Revalidate the form when categoriaTercero changes
      this.RepresentantesForm.get('representantes')?.updateValueAndValidity();
    }
    this.documentosFiltrados = this.ListaTipoDocumentos.filter(tipo => tipo.id !== '3');

  }


  ngOnInit(): void {

    this.formulario = this.fb.group({
      representantes: this.fb.array([],)
    });

    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      this.originalValidators[key] = control?.validator;
    });
    if (this.IdFormulario !== 0 && this.IdFormulario !== undefined) {
      this.ConsultaInfoRepresentantes();
    }
  }

  ConsultaInfoRepresentantes() {
    this.serviciocliente.cosultaRepresentates(this.IdFormulario).subscribe(data => {
      console.log(data)
      if (data) {
        this.setRepresentante(data.representantes);
      }
      if (!this.editable) {

        this.RepresentantesForm.disable();
        //this.deshabilitarFormulario(this.DatosContactos);
      }
    });
  }
  limpiarControles(controles: string[]) {
    for (const control of controles) {
      this.representantes.get(control)?.setValue('');
    }
  }



  setRepresentante(RepresentanteData: any[]): void {
    const RepresentantesFormArray = this.RepresentantesForm.get('representantes') as FormArray;
    RepresentanteData.forEach((representante) => {

      const PaisesObligacionTributariaArray = typeof representante.PaisesObligacionTributaria === 'string' && representante.PaisesObligacionTributaria.trim() !== ''
        ? representante.PaisesObligacionTributaria.split(',').map((pais: string) => pais.trim())
        : [];


      const PaisesPaisesCuentasExtArray = typeof representante.PaisesCuentasExt === 'string' && representante.PaisesCuentasExt.trim() !== ''
        ? representante.PaisesCuentasExt.split(',').map((pais: string) => pais.trim())
        : [];

      const PaisesPoderCuentaExtranjeraArray = typeof representante.PaisesPoderCuentaExtranjera === 'string' && representante.PaisesPoderCuentaExtranjera.trim() !== ''
        ? representante.PaisesPoderCuentaExtranjera.split(',').map((pais: string) => pais.trim())
        : [];

      const RepresentanteFormGroup = this.fb.group({
        nombre: [representante.nombre, [Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]],
        tipoDocumento: [representante.tipoDocumento, [, noSeleccionadoValidator()]],
        NumeroIdentificacion: [representante.NumeroIdentificacion],
        Direccion: [representante.Direccion],
        Ciudad: [representante.Ciudad, [Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]],
        Nacionalidad: [representante.Nacionalidad, [, noSeleccionadoValidator()]],
        Telefono: [representante.Telefono],
        CorreoElectronico: [representante.CorreoElectronico, [IdentificacionValidators.emailWithComValidator()]],
        vinculadoPep: [representante.vinculadoPep],
        // Campos PEP
        ManejaRecursos: [representante.ManejaRecursos],
        CualesRecursos: [representante.CualesRecursos],
        PoderPolitico: [representante.PoderPolitico],
        RamaPoderPublico: [representante.RamaPoderPublico],
        CargoPublico: [representante.CargoPublico],
        CualCargoPublico: [representante.CualCargoPublico],
        hasidoPep2: [representante.hasidoPep2],
        cargosPublicos: this.fb.array(representante.cargosPublicos ? representante.cargosPublicos.map((c: any) => this.crearcargospublicosForm(c)) : []),
        Tienevinculosmas5: [representante.Tienevinculosmas5],
        Vinculosmas: this.fb.array(representante.Vinculosmas ? representante.Vinculosmas.map((v: any) => this.crearVinculoForm(v)) : []),
        InfoFamiliaPep: this.fb.array(representante.InfoFamiliaPep ? representante.InfoFamiliaPep.map((f: any) => this.crearInfoFamiliaForm(f)) : []),
      }); RepresentantesFormArray.push(RepresentanteFormGroup);


      IdentificacionValidators.setupIdentificacionValidationForFormGroup(
        RepresentanteFormGroup,
        'tipoDocumento',
        'NumeroIdentificacion'
      );


      IdentificacionValidators.configureMultipleNestedFormArrays(RepresentanteFormGroup, [
        { arrayName: 'Vinculosmas', tipoDocField: 'TipoIdentificacion', numeroIdField: 'NumeroIdentificacion' },
        { arrayName: 'InfoFamiliaPep', tipoDocField: 'TipoIdentificacion', numeroIdField: 'NumeroIdentificacion' }
      ]);

      RepresentanteFormGroup.get('vinculadoPep')?.valueChanges.subscribe((value: any) => {
        if (value === '0') {
          this.resetControls(RepresentanteFormGroup);
        }
        this.initializeFormSubscriptions(RepresentanteFormGroup, value);
      });

      if (representante.vinculadoPep === '1') {
        this.ajustarValidacionesotroscampos(RepresentanteFormGroup, representante);
      } else {
        this.initializeFormSubscriptions(RepresentanteFormGroup, '0');
      }
      //this.ajustarValidaciones(RepresentanteFormGroup, representante.vinculadoPep);
      //this.ajustarValidacionesotroscampos(RepresentanteFormGroup, representante);
    });
  }

  private ajustarValidacionesotroscampos(formGroup: FormGroup, representante: any): void {
    // Configurar validaciones para ManejaRecursos y CualesRecursos
    if (representante.ManejaRecursos === '0' || representante.ManejaRecursos === 0) {
      formGroup.get('CualesRecursos')?.clearValidators();
      formGroup.get('CualesRecursos')?.setValue('');
    } else {
      formGroup.get('CualesRecursos')?.setValidators([]);
    }

    // Configurar validaciones para PoderPolitico y RamaPoderPublico
    if (representante.PoderPolitico === '0' || representante.PoderPolitico === 0) {
      formGroup.get('RamaPoderPublico')?.clearValidators();
      formGroup.get('RamaPoderPublico')?.setValue('');
    } else {
      formGroup.get('RamaPoderPublico')?.setValidators([]);
    }

    // Configurar validaciones para CargoPublico y CualCargoPublico
    if (representante.CargoPublico === '0' || representante.CargoPublico === 0) {
      formGroup.get('CualCargoPublico')?.clearValidators();
      formGroup.get('CualCargoPublico')?.setValue('');
    } else {
      formGroup.get('CualCargoPublico')?.setValidators([]);
    }

    // Configurar validaciones para ObligacionTributaria y PaisesObligacionTributaria
    if (representante.ObligacionTributaria === '0' || representante.ObligacionTributaria === 0) {
      formGroup.get('PaisesObligacionTributaria')?.clearValidators();
      formGroup.get('PaisesObligacionTributaria')?.setValue([]);
    } else {
      formGroup.get('PaisesObligacionTributaria')?.setValidators([]);
    }

    // Configurar validaciones para CuentasFinancierasExt y PaisesCuentasExt
    if (representante.CuentasFinancierasExt === '0' || representante.CuentasFinancierasExt === 0) {
      formGroup.get('PaisesCuentasExt')?.clearValidators();
      formGroup.get('PaisesCuentasExt')?.setValue([]);
    } else {
      formGroup.get('PaisesCuentasExt')?.setValidators([]);
    }

    // Configurar validaciones para TienePoderCuentaExtranjera y PaisesPoderCuentaExtranjera
    if (representante.TienePoderCuentaExtranjera === '0' || representante.TienePoderCuentaExtranjera === 0) {
      formGroup.get('PaisesPoderCuentaExtranjera')?.clearValidators();
      formGroup.get('PaisesPoderCuentaExtranjera')?.setValue([]);
    } else {
      formGroup.get('PaisesPoderCuentaExtranjera')?.setValidators([]);
    }

    // Actualizar la validez de todos los campos
    formGroup.get('CualesRecursos')?.updateValueAndValidity();
    formGroup.get('RamaPoderPublico')?.updateValueAndValidity();
    formGroup.get('CualCargoPublico')?.updateValueAndValidity();
    formGroup.get('PaisesObligacionTributaria')?.updateValueAndValidity();
    formGroup.get('PaisesCuentasExt')?.updateValueAndValidity();
    formGroup.get('PaisesPoderCuentaExtranjera')?.updateValueAndValidity();
  }

  private ajustarValidaciones(formGroup: FormGroup, vinculadoPepValue: string): void {
    const campos = [
      'ManejaRecursos', 'CualesRecursos', 'PoderPolitico', 'RamaPoderPublico',
      'CargoPublico', 'CualCargoPublico', 'ObligacionTributaria',
      'PaisesObligacionTributaria', 'CuentasFinancierasExt', 'PaisesCuentasExt',
      'TienePoderCuentaExtranjera', 'PaisesPoderCuentaExtranjera', 'Tienevinculosmas5'
    ];

    if (vinculadoPepValue === '0') {
      campos.forEach(campo => {
        formGroup.get(campo)?.clearValidators();
      });
    } else {
      campos.forEach(campo => {
        formGroup.get(campo)?.setValidators([]);
      });
    }

    campos.forEach(campo => {
      formGroup.get(campo)?.updateValueAndValidity();
    });
  }


  crearcargospublicosForm(cargo?: any): FormGroup {
    return this.fb.group({
      NombreEntidad: [cargo?.NombreEntidad || '0',],
      FechaIngreso: [cargo?.FechaIngreso || '0',],
      FechaDesvinculacion: [cargo?.FechaDesvinculacion || ''],
    });
  }
  crearVinculoForm(vinculo?: any): FormGroup {
    return this.fb.group({
      NombreCompleto: [vinculo?.NombreCompleto || '0', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)],
      TipoIdentificacion: [vinculo?.TipoIdentificacion || '-1', [noSeleccionadoValidator()]],
      NumeroIdentificacion: [vinculo?.NumeroIdentificacion || '0',],
      Pais: [vinculo?.Pais || '', [noSeleccionadoValidator()]],
      PorcentajeParticipacion: [vinculo?.PorcentajeParticipacion || '0',],
    });
  }
  crearInfoFamiliaForm(infoFamilia?: any): FormGroup {
    return this.fb.group({
      NombreCompleto: [infoFamilia?.NombreCompleto || '0', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)],
      TipoIdentificacion: [infoFamilia?.TipoIdentificacion || '-1', [noSeleccionadoValidator()]],
      NumeroIdentificacion: [infoFamilia?.NumeroIdentificacion || '0',],
      Nacionalidad: [infoFamilia?.Nacionalidad || '-1', [noSeleccionadoValidator()]],
      CargoContacto: [infoFamilia?.CargoContacto || '0',],
      FechaNombramiento: [infoFamilia?.FechaNombramiento || '0',],
      FechaFinalizacion: [infoFamilia?.FechaFinalizacion || '0',],
      VinculoFamiliar: [infoFamilia?.VinculoFamiliar || '0',],
    });
  }
  enviarFormulario(): void {
    if (this.formulario.valid) {
      console.log('Datos del formulario:', this.formulario.value);
    } else {
      console.log('Formulario no válido');
      this.formulario.markAllAsTouched();
    }
  }

  get representantes() {
    return this.RepresentantesForm.get('representantes') as FormArray;
  }
  addRepresentante() {
    const representanteForm = this.crearRepresentante();
    this.representantes.push(representanteForm);


    IdentificacionValidators.setupIdentificacionValidationForFormGroup(
      representanteForm,
      'tipoDocumento',
      'NumeroIdentificacion'
    );


    IdentificacionValidators.configureMultipleNestedFormArrays(representanteForm, [
      { arrayName: 'Vinculosmas', tipoDocField: 'TipoIdentificacion', numeroIdField: 'NumeroIdentificacion' },
      { arrayName: 'InfoFamiliaPep', tipoDocField: 'TipoIdentificacion', numeroIdField: 'NumeroIdentificacion' }
    ]);

    this.listenVinculadoPep(representanteForm);
    representanteForm.get('vinculadoPep')?.valueChanges.subscribe(value => {
      if (value === '0') {
        this.resetControls(representanteForm);
      }
      this.initializeFormSubscriptions(representanteForm, value);
    });
    representanteForm.get('hasidoPep2')?.valueChanges.subscribe(value => {
      this.initializeFormSubscriptionsCargos(representanteForm, value);
    });
    representanteForm.get('Tienevinculosmas5')?.valueChanges.subscribe(value => {
      this.initializeFormSubsvinculadosmas5(representanteForm, value);
    });

    representanteForm.get('ManejaRecursos')?.valueChanges.subscribe(value => {
      const cualesRecursosControl = representanteForm.get('CualesRecursos');
      if (value !== '1' && value !== 1) {
        cualesRecursosControl?.clearValidators();
        cualesRecursosControl?.setValue('');
      } else {
        cualesRecursosControl?.setValidators([]);
      }
      cualesRecursosControl?.updateValueAndValidity();
    });
    representanteForm.get('PoderPolitico')?.valueChanges.subscribe(value => {
      const ramaPoderPublicoControl = representanteForm.get('RamaPoderPublico');
      if (value !== '1' && value !== 1) {
        ramaPoderPublicoControl?.clearValidators();
        ramaPoderPublicoControl?.setValue('');
      } else {
        ramaPoderPublicoControl?.setValidators([]);
      }
      ramaPoderPublicoControl?.updateValueAndValidity();
    });
    representanteForm.get('CargoPublico')?.valueChanges.subscribe(value => {
      const cualCargoPublicoControl = representanteForm.get('CualCargoPublico');
      if (value !== '1' && value !== 1) {
        cualCargoPublicoControl?.clearValidators();
        cualCargoPublicoControl?.setValue('');
      } else {
        cualCargoPublicoControl?.setValidators([]);
      }
      cualCargoPublicoControl?.updateValueAndValidity();
    });
    representanteForm.get('ObligacionTributaria')?.valueChanges.subscribe(value => {
      const paisesObligacionControl = representanteForm.get('PaisesObligacionTributaria');
      if (value !== '1' && value !== 1) {
        paisesObligacionControl?.clearValidators();
        paisesObligacionControl?.setValue([]);
      } else {
        paisesObligacionControl?.setValidators([]);
      }
      paisesObligacionControl?.updateValueAndValidity();
    });
    representanteForm.get('CuentasFinancierasExt')?.valueChanges.subscribe(value => {
      const paisesCuentasExtControl = representanteForm.get('PaisesCuentasExt');
      if (value !== '1' && value !== 1) {
        paisesCuentasExtControl?.clearValidators();
        paisesCuentasExtControl?.setValue([]);
      } else {
        paisesCuentasExtControl?.setValidators([]);
      }
      paisesCuentasExtControl?.updateValueAndValidity();
    });
    representanteForm.get('TienePoderCuentaExtranjera')?.valueChanges.subscribe(value => {
      const paisesPoderCuentaExtranjeraControl = representanteForm.get('PaisesPoderCuentaExtranjera');
      if (value !== '1' && value !== 1) {
        paisesPoderCuentaExtranjeraControl?.clearValidators();
        paisesPoderCuentaExtranjeraControl?.setValue([]);
      } else {
        paisesPoderCuentaExtranjeraControl?.setValidators([]);
      }
      paisesPoderCuentaExtranjeraControl?.updateValueAndValidity();
    });
  }
  private initializeFormSubscriptions(representanteForm: FormGroup, value: any) {
    if (value !== '1') {
      representanteForm.get('ManejaRecursos')?.clearValidators();
      representanteForm.get('CualesRecursos')?.clearValidators();
      representanteForm.get('PoderPolitico')?.clearValidators();
      representanteForm.get('RamaPoderPublico')?.clearValidators();
      representanteForm.get('CargoPublico')?.clearValidators();
      representanteForm.get('CualCargoPublico')?.clearValidators();
      representanteForm.get('ObligacionTributaria')?.clearValidators();
      representanteForm.get('PaisesObligacionTributaria')?.clearValidators();
      representanteForm.get('CuentasFinancierasExt')?.clearValidators();
      representanteForm.get('PaisesCuentasExt')?.clearValidators();
      representanteForm.get('TienePoderCuentaExtranjera')?.clearValidators();
      representanteForm.get('PaisesPoderCuentaExtranjera')?.clearValidators();
      representanteForm.get('hasidoPep2')?.clearValidators();
      representanteForm.get('Tienevinculosmas5')?.clearValidators();
      representanteForm.get('InfoFamiliaPep')?.clearValidators();
    } else {
      representanteForm.get('ManejaRecursos')?.setValidators([noSeleccionadoValidator()]);
      representanteForm.get('CualesRecursos')?.setValidators([]);
      representanteForm.get('PoderPolitico')?.setValidators([noSeleccionadoValidator()]);
      representanteForm.get('RamaPoderPublico')?.setValidators([]);
      representanteForm.get('CargoPublico')?.setValidators([noSeleccionadoValidator()]);
      representanteForm.get('ObligacionTributaria')?.setValidators([noSeleccionadoValidator()]);
      representanteForm.get('PaisesObligacionTributaria')?.setValidators([noSeleccionadoValidator()]);
      representanteForm.get('CuentasFinancierasExt')?.setValidators([noSeleccionadoValidator()]);
      representanteForm.get('PaisesCuentasExt')?.setValidators([noSeleccionadoValidator()]);
      representanteForm.get('TienePoderCuentaExtranjera')?.setValidators([noSeleccionadoValidator()]);
      representanteForm.get('PaisesPoderCuentaExtranjera')?.setValidators([noSeleccionadoValidator()]);
      representanteForm.get('hasidoPep2')?.setValidators([noSeleccionadoValidator()]);
      representanteForm.get('Tienevinculosmas5')?.setValidators([noSeleccionadoValidator()]);
      representanteForm.get('InfoFamiliaPep')?.setValidators([]);
    }

    representanteForm.get('ManejaRecursos')?.updateValueAndValidity();
    representanteForm.get('CualesRecursos')?.updateValueAndValidity();
    representanteForm.get('PoderPolitico')?.updateValueAndValidity();
    representanteForm.get('RamaPoderPublico')?.updateValueAndValidity();
    representanteForm.get('CualCargoPublico')?.updateValueAndValidity();
    representanteForm.get('ObligacionTributaria')?.updateValueAndValidity();
    representanteForm.get('PaisesObligacionTributaria')?.updateValueAndValidity();
    representanteForm.get('CuentasFinancierasExt')?.updateValueAndValidity();
    representanteForm.get('PaisesCuentasExt')?.updateValueAndValidity();
    representanteForm.get('TienePoderCuentaExtranjera')?.updateValueAndValidity();
    representanteForm.get('PaisesPoderCuentaExtranjera')?.updateValueAndValidity();
    representanteForm.get('hasidoPep2')?.updateValueAndValidity();
    representanteForm.get('Tienevinculosmas5')?.updateValueAndValidity();
    representanteForm.get('InfoFamiliaPep')?.updateValueAndValidity();
  }

  allowOnlyNumbers(event: KeyboardEvent, representanteIndex: number): void {
    const representanteForm = this.representantes.at(representanteIndex) as FormGroup;
    const tipoId = representanteForm.get('tipoDocumento')?.value;
    IdentificacionValidators.allowOnlyNumbers(event, tipoId);
  }


  validateNumeroIdentificacionInput(event: any, representanteIndex: number): void {
    const representanteForm = this.representantes.at(representanteIndex) as FormGroup;
    const tipoId = representanteForm.get('tipoDocumento')?.value;
    const control = representanteForm.get('NumeroIdentificacion');
    IdentificacionValidators.validateNumeroIdentificacionInput(event, tipoId, control);
  }

  private initializeFormSubscriptionsCargos(representanteForm: FormGroup, value: any) {
    if (value !== '1') {
      representanteForm.get('cargosPublicos')?.clearValidators();
    } else {
      representanteForm.get('cargosPublicos')?.setValidators([]);
    }
    representanteForm.get('cargosPublicos')?.updateValueAndValidity();
  }

  private initializeFormSubsvinculadosmas5(representanteForm: FormGroup, value: any) {
    if (value !== '1') {
      representanteForm.get('Vinculosmas')?.clearValidators();
    } else {
      representanteForm.get('Vinculosmas')?.setValidators([]);
    }
    representanteForm.get('Vinculosmas')?.updateValueAndValidity();
  }


  resetControls(representanteForm: FormGroup) {
    const cargosPublicosArray = representanteForm.get('cargosPublicos') as FormArray;
    cargosPublicosArray.clear();
    const vinculosMasArray = representanteForm.get('Vinculosmas') as FormArray;
    vinculosMasArray.clear();
    const infoFamiliaPepArray = representanteForm.get('InfoFamiliaPep') as FormArray;
    infoFamiliaPepArray.clear();
    representanteForm.patchValue({
      ManejaRecursos: '-1',
      CualesRecursos: '',
      PoderPolitico: '-1',
      RamaPoderPublico: '',
      CargoPublico: '-1',
      CualCargoPublico: '',
      ObligacionTributaria: '-1',
      PaisesObligacionTributaria: [],
      CuentasFinancierasExt: '-1',
      PaisesCuentasExt: [],
      TienePoderCuentaExtranjera: '-1',
      PaisesPoderCuentaExtranjera: [],
      hasidoPep2: '-1',
      Tienevinculosmas5: '-1',
    });
  }

  removeRepresentante(index: number) {
    this.representantes.removeAt(index);
  }

  crearRepresentante(): FormGroup {
    return this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        ]
      ],
      tipoDocumento: ['-1', [Validators.required, noSeleccionadoValidator()]],
      NumeroIdentificacion: ['', Validators.required],
      Direccion: [''],
      Ciudad: [
        '',
        [
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        ]
      ],
      Nacionalidad: ['-1', [Validators.required, noSeleccionadoValidator()]],
      Telefono: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]*$/)
        ]
      ],
      CorreoElectronico: [
        '',
        [
          Validators.required,
          IdentificacionValidators.emailWithComValidator()
        ]
      ],
      vinculadoPep: ['-1', [Validators.required, noSeleccionadoValidator()]],
      ManejaRecursos: ['-1'],
      CualesRecursos: [''],
      PoderPolitico: ['-1'],
      RamaPoderPublico: [''],
      CargoPublico: ['-1'],
      CualCargoPublico: [''],
      hasidoPep2: ['-1'],
      cargosPublicos: this.fb.array([]),
      Tienevinculosmas5: [''],
      Vinculosmas: this.fb.array([]),
      InfoFamiliaPep: this.fb.array([]),
    });
  }


  // Obtener el FormArray de cargos públicos para un representante específico
  getCargosPublicos(representanteIndex: number): FormArray {
    return this.representantes.at(representanteIndex).get('cargosPublicos') as FormArray;
  }


  crearcargospublicos() {
    return this.fb.group({
      NombreEntidad: ['',],
      FechaIngreso: ['',],
      FechaDesvinculacion: ['']
    });
  }

  removeCargoPublico(representanteIndex: number, cargoIndex: number) {
    const cargosPublicos = this.getCargosPublicos(representanteIndex);
    cargosPublicos.removeAt(cargoIndex);
  }

  removeVinculomas5(representanteIndex: number, cargoIndex: number) {
    const vinculomas5 = this.getVinculomas5(representanteIndex);
    vinculomas5.removeAt(cargoIndex);
  }


  // Agregar un cargo público cuando `hasidoPep2` es "si"
  addCargoPublico(representanteIndex: number) {
    const cargosPublicos = this.getCargosPublicos(representanteIndex);
    const cargoPublicoForm = this.fb.group({
      NombreEntidad: ['',],
      FechaIngreso: ['',],
      FechaDesvinculacion: [''],

    });
    cargosPublicos.push(cargoPublicoForm);
  }
  addVinculomas5(representanteIndex: number) {
    const vinculosmas5 = this.getVinculomas5(representanteIndex);
    const vinculosmas5Form = this.fb.group({
      NombreCompleto: ['', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)],
      TipoIdentificacion: ['-1', [noSeleccionadoValidator()]],
      NumeroIdentificacion: ['',],
      Pais: ['-1', [noSeleccionadoValidator()]],
      PorcentajeParticipacion: ['',],
    });

    IdentificacionValidators.setupIdentificacionValidationForFormGroup(
      vinculosmas5Form,
      'TipoIdentificacion',
      'NumeroIdentificacion'
    );

    vinculosmas5.push(vinculosmas5Form);
  }

  getVinculomas5(vinculomas5Index: number): FormArray {
    return this.representantes.at(vinculomas5Index).get('Vinculosmas') as FormArray;
  }


  getInfoFamiliar(indofamiliarIndex: number): FormArray {
    return this.representantes.at(indofamiliarIndex).get('InfoFamiliaPep') as FormArray;
  }

  addInfoFamilia(representanteIndex: number) {
    const InfoFamilia = this.getInfoFamiliar(representanteIndex);
    const InfoFamiliaForm = this.fb.group({
      NombreCompleto: ['',],
      TipoIdentificacion: ['-1', [noSeleccionadoValidator()]],
      NumeroIdentificacion: ['',],
      Nacionalidad: ['-1', [noSeleccionadoValidator()]],
      CargoContacto: ['',],
      FechaNombramiento: ['',],
      NumeroIdentificacionT: ['',],
      FechaFinalizacion: ['',],
      VinculoFamiliar: ['',],

    });


    IdentificacionValidators.setupIdentificacionValidationForFormGroup(
      InfoFamiliaForm,
      'TipoIdentificacion',
      'NumeroIdentificacion'
    );

    InfoFamilia.push(InfoFamiliaForm);
  }

  removeInfoFamilia(representanteIndex: number, FamilairIndex: number) {
    const InfoFamilia = this.getInfoFamiliar(representanteIndex);
    InfoFamilia.removeAt(FamilairIndex);
  }

  listenVinculadoPep(representanteForm: FormGroup) {
    representanteForm.get('vinculadoPep')?.valueChanges.subscribe(value => {
      const fields = [
        'ManejaRecursos',
        'CualesRecursos',
        'PoderPolitico',
        'RamaPoderPublico',
        'CargoPublico',
        'CualCargoPublico',
        'ObligacionTributaria',
        'PaisesObligacionTributaria',
        'CuentasFinancierasExt',
        'PaisesCuentasExt',
        'TienePoderCuentaExtranjera',
        'PaisesPoderCuentaExtranjera',
        'Tienevinculosmas5'
      ];

      if (value === '0') {
        fields.forEach(field => {
          representanteForm.get(field)?.clearValidators();
          representanteForm.get(field)?.updateValueAndValidity();
        });
      } else {
        fields.forEach(field => {

        });
      }
    });
  }

  /**
   * Determina si un campo inválido debe ser ignorado basado en validaciones condicionales
   * @param representanteGroup - El FormGroup del representante
   * @param field - El nombre del campo a verificar
   * @returns true si el campo debe ser ignorado, false en caso contrario
   */
  private debeIgnorarCampoInvalido(representanteGroup: FormGroup, field: string): boolean {
    const vinculadoPep = representanteGroup.get('vinculadoPep')?.value;

    // Si no está vinculado a PEP, ignorar todos los campos relacionados con PEP
    if (vinculadoPep === '0' || vinculadoPep === 0) {
      const camposPep = [
        'ManejaRecursos', 'CualesRecursos', 'PoderPolitico', 'RamaPoderPublico',
        'CargoPublico', 'CualCargoPublico', 'ObligacionTributaria', 'PaisesObligacionTributaria',
        'CuentasFinancierasExt', 'PaisesCuentasExt', 'TienePoderCuentaExtranjera',
        'PaisesPoderCuentaExtranjera', 'hasidoPep2', 'Tienevinculosmas5'
      ];

      if (camposPep.includes(field)) {
        return true;
      }
    }

    // Verificar campos condicionales específicos
    switch (field) {
      case 'PaisesObligacionTributaria':
        const obligacionTributaria = representanteGroup.get('ObligacionTributaria')?.value;
        return obligacionTributaria === '0' || obligacionTributaria === 0;

      case 'PaisesCuentasExt':
        const cuentasFinancierasExt = representanteGroup.get('CuentasFinancierasExt')?.value;
        return cuentasFinancierasExt === '0' || cuentasFinancierasExt === 0;

      case 'PaisesPoderCuentaExtranjera':
        const tienePoderCuentaExtranjera = representanteGroup.get('TienePoderCuentaExtranjera')?.value;
        return tienePoderCuentaExtranjera === '0' || tienePoderCuentaExtranjera === 0;

      case 'CualesRecursos':
        const manejaRecursos = representanteGroup.get('ManejaRecursos')?.value;
        return manejaRecursos === '0' || manejaRecursos === 0;

      case 'RamaPoderPublico':
        const poderPolitico = representanteGroup.get('PoderPolitico')?.value;
        return poderPolitico === '0' || poderPolitico === 0;

      case 'CualCargoPublico':
        const cargoPublico = representanteGroup.get('CargoPublico')?.value;
        return cargoPublico === '0' || cargoPublico === 0;

      default:
        return false;
    }
  }

  obtenerCamposInvalidos(): any[] {
    // Primero revalidar campos condicionales
    this.revalidarCamposCondicionales();

    const invalidFields: any[] = [];

    // Recorre el FormArray de representantes
    (this.representantes.controls as FormGroup[]).forEach((representanteGroup, representanteIndex) => {
      // Verifica cada control en el FormGroup del representante
      Object.keys((representanteGroup as FormGroup).controls).forEach(field => {
        const control = representanteGroup.get(field);

        if (control && control.invalid) {
          // Verificar si este campo debe ser ignorado por su contexto condicional
          if (!this.debeIgnorarCampoInvalido(representanteGroup, field)) {
            invalidFields.push({
              representanteIndex,
              field,
              errors: control.errors
            });
          }
        }

        // Verifica si el campo es un FormArray, como cargosPublicos, Vinculosmas, o InfoFamiliaPep
        if (control instanceof FormArray) {
          (control.controls as FormGroup[]).forEach((subControlGroup, subIndex) => {
            Object.keys((subControlGroup as FormGroup).controls).forEach(subField => {
              const subControl = subControlGroup.get(subField);
              if (subControl && subControl.invalid) {
                invalidFields.push({
                  representanteIndex,
                  subArray: field,
                  subIndex,
                  subField,
                  errors: subControl.errors
                });
              }
            });
          });
        }
      });
    });

    return invalidFields;
  }


  // Enviar el formulario completo
  submit() {

    const invalidFields = this.obtenerCamposInvalidos();

    const formValue = this.RepresentantesForm.value;

    this.marcarFormularioComoTocado();

  }
  marcarFormularioComoTocado() {
    Object.values(this.RepresentantesForm.controls).forEach(control => {
      if (control instanceof FormControl) {
        // Si es un FormControl, lo marcamos como tocado
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        // Si es un FormGroup, llamamos recursivamente al método para marcar sus subcontroles
        this.marcarGrupoComoTocado(control);
      } else if (control instanceof FormArray) {
        // Si es un FormArray, recorremos cada elemento y aplicamos la misma lógica
        control.controls.forEach(subControl => {
          if (subControl instanceof FormGroup) {
            this.marcarGrupoComoTocado(subControl);
          } else {
            subControl.markAsTouched({ onlySelf: true });
          }
        });
      }
    });
  }

  private marcarGrupoComoTocado(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.marcarGrupoComoTocado(control); // Llamada recursiva para subgrupos
      } else if (control instanceof FormArray) {
        control.controls.forEach(subControl => {
          if (subControl instanceof FormGroup) {
            this.marcarGrupoComoTocado(subControl);
          } else {
            subControl.markAsTouched({ onlySelf: true });
          }
        });
      }
    });
  }

  removeValidators(): void {
    if (!this.formulario) {
      console.warn('Formulario no definido en RepresentanteLegalComponent');
      return;
    }
    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      if (control) {
        control.clearValidators();
        control.clearAsyncValidators();
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  restoreValidators(): void {
    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      if (control) {
        control.setValidators(this.originalValidators[key]);
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }


  obtenerDatosFormulario(isValidSave: boolean): any {
    if (isValidSave) {
      this.RepresentantesForm.markAllAsTouched();
    }

    const formularioValores = this.RepresentantesForm.value;

    formularioValores.representantes.forEach((representante: any) => {
      if (Array.isArray(representante.PaisesObligacionTributaria)) {
        representante.PaisesObligacionTributaria = representante.PaisesObligacionTributaria.join(', ');
      }
      if (Array.isArray(representante.PaisesCuentasExt)) {
        representante.PaisesCuentasExt = representante.PaisesCuentasExt.join(', ');
      }
      if (Array.isArray(representante.PaisesPoderCuentaExtranjera)) {
        representante.PaisesPoderCuentaExtranjera = representante.PaisesPoderCuentaExtranjera.join(', ');
      }
    });

    return formularioValores;
  }


  /**
   * Revalida todos los campos condicionales del formulario
   * Este método asegura que las validaciones condicionales se apliquen correctamente
   */
  private revalidarCamposCondicionales(): void {
    const representantesArray = this.RepresentantesForm.get('representantes') as FormArray;

    representantesArray.controls.forEach((representanteGroup: AbstractControl) => {
      const formGroup = representanteGroup as FormGroup;

      // Revalidar campos dependientes de ObligacionTributaria
      const obligacionTributaria = formGroup.get('ObligacionTributaria')?.value;
      const paisesObligacionControl = formGroup.get('PaisesObligacionTributaria');

      if (obligacionTributaria === '0' || obligacionTributaria === 0) {
        paisesObligacionControl?.clearValidators();
        paisesObligacionControl?.setValue([]);
      } else if (obligacionTributaria === '1' || obligacionTributaria === 1) {
        paisesObligacionControl?.setValidators([]);
      }
      paisesObligacionControl?.updateValueAndValidity();

      // Revalidar campos dependientes de CuentasFinancierasExt
      const cuentasFinancierasExt = formGroup.get('CuentasFinancierasExt')?.value;
      const paisesCuentasExtControl = formGroup.get('PaisesCuentasExt');

      if (cuentasFinancierasExt === '0' || cuentasFinancierasExt === 0) {
        paisesCuentasExtControl?.clearValidators();
        paisesCuentasExtControl?.setValue([]);
      } else if (cuentasFinancierasExt === '1' || cuentasFinancierasExt === 1) {
        paisesCuentasExtControl?.setValidators([]);
      }
      paisesCuentasExtControl?.updateValueAndValidity();

      // Revalidar campos dependientes de TienePoderCuentaExtranjera
      const tienePoderCuentaExtranjera = formGroup.get('TienePoderCuentaExtranjera')?.value;
      const paisesPoderCuentaExtranjeraControl = formGroup.get('PaisesPoderCuentaExtranjera');

      if (tienePoderCuentaExtranjera === '0' || tienePoderCuentaExtranjera === 0) {
        paisesPoderCuentaExtranjeraControl?.clearValidators();
        paisesPoderCuentaExtranjeraControl?.setValue([]);
      } else if (tienePoderCuentaExtranjera === '1' || tienePoderCuentaExtranjera === 1) {
        paisesPoderCuentaExtranjeraControl?.setValidators([]);
      }
      paisesPoderCuentaExtranjeraControl?.updateValueAndValidity();

      // Revalidar campos dependientes de ManejaRecursos
      const manejaRecursos = formGroup.get('ManejaRecursos')?.value;
      const cualesRecursosControl = formGroup.get('CualesRecursos');

      if (manejaRecursos === '0' || manejaRecursos === 0) {
        cualesRecursosControl?.clearValidators();
      } else if (manejaRecursos === '1' || manejaRecursos === 1) {
        cualesRecursosControl?.setValidators([]);
      }
      cualesRecursosControl?.updateValueAndValidity();

      // Revalidar campos dependientes de PoderPolitico
      const poderPolitico = formGroup.get('PoderPolitico')?.value;
      const ramaPoderPublicoControl = formGroup.get('RamaPoderPublico');

      if (poderPolitico === '0' || poderPolitico === 0) {
        ramaPoderPublicoControl?.clearValidators();
      } else if (poderPolitico === '1' || poderPolitico === 1) {
        ramaPoderPublicoControl?.setValidators([]);
      }
      ramaPoderPublicoControl?.updateValueAndValidity();

      // Revalidar campos dependientes de CargoPublico
      const cargoPublico = formGroup.get('CargoPublico')?.value;
      const cualCargoPublicoControl = formGroup.get('CualCargoPublico');

      if (cargoPublico === '0' || cargoPublico === 0) {
        cualCargoPublicoControl?.clearValidators();
      } else if (cargoPublico === '1' || cargoPublico === 1) {
        cualCargoPublicoControl?.setValidators([]);
      }
      cualCargoPublicoControl?.updateValueAndValidity();
    });
  }
  esFormularioValido(): boolean {
    const representantesArray = this.RepresentantesForm.get('representantes') as FormArray;

    // marcar todo para mostrar errores
    representantesArray.markAllAsTouched();
    representantesArray.updateValueAndValidity({ emitEvent: false });

    // 🔹 Validar que exista al menos un representante con primerNombre lleno
    const tieneAlgunoConNombre = representantesArray.controls.some(control => {
      const nombre = control.get('nombre')?.value;
      return nombre && nombre.trim() !== '';
    });

    // 🔹 Si NO hay ninguno con nombre → devolver false
    if (!tieneAlgunoConNombre) {
      return false;
    }

    // 🔹 Si pasa la regla anterior → usar la validación normal de Angular
    return representantesArray.valid;
  }



  private validarCamposCondicionales(representanteForm: FormGroup): boolean {
    const vinculadoPep = representanteForm.get('vinculadoPep')?.value;

    // Only validate conditional fields if user is PEP
    if (vinculadoPep !== '1' && vinculadoPep !== 1) {
      return true;
    }

    // Validate ManejaRecursos -> CualesRecursos
    const manejaRecursos = representanteForm.get('ManejaRecursos')?.value;
    if (manejaRecursos === '1' || manejaRecursos === 1) {
      const cualesRecursos = representanteForm.get('CualesRecursos')?.value;
      if (!cualesRecursos || cualesRecursos.trim() === '') {
        return false;
      }
    }

    // Validate PoderPolitico -> RamaPoderPublico
    const poderPolitico = representanteForm.get('PoderPolitico')?.value;
    if (poderPolitico === '1' || poderPolitico === 1) {
      const ramaPoderPublico = representanteForm.get('RamaPoderPublico')?.value;
      if (!ramaPoderPublico || ramaPoderPublico.trim() === '') {
        return false;
      }
    }

    // Validate CargoPublico -> CualCargoPublico
    const cargoPublico = representanteForm.get('CargoPublico')?.value;
    if (cargoPublico === '1' || cargoPublico === 1) {
      const cualCargoPublico = representanteForm.get('CualCargoPublico')?.value;
      if (!cualCargoPublico || cualCargoPublico.trim() === '') {
        return false;
      }
    }

    return true;
  }

  /*Generarpdf()
    {


      const content = document.getElementById('Representantespdf');  // Asegúrate de que el ID coincida


      if (content) {
        const contentHeight = content.scrollHeight; // Altura del contenido
        const pageHeightInMM = contentHeight * 0.264583; // Convertir px a mm (1px = 0.264583mm)
        const pdf = new jsPDF('p', 'mm', [pageHeightInMM, 210]); // Altu // Verificación de null
        pdf.html(content, {
          callback: (doc) => {
            doc.save('documento.pdf');
          },
          margin: [2  , 10, 10, 2],  // Márgenes (arriba, derecha, abajo, izquierda)
          x: 10,  // Posición horizontal
          y: 10,  // Posición vertical inicial
          autoPaging: 'text',  // Paginación automática según el texto
          width: 180, // Ajustar ancho al tamaño de la página
          windowWidth: content.scrollWidth, // Ajustar escala
        });
      } else {
        console.error("Elemento HTML con id 'htmlContent' no encontrado.");
      }
    }

  */



  generarPDF2() {
    const div = document.getElementById('Representantespdf');
    if (!div) {
      console.error('No se encontró el div con id Representantespdf');
      return;
    }

    // Crear un contenedor A4
    const a4Container = document.createElement('div');
    a4Container.classList.add('a4-container');
    a4Container.appendChild(div.cloneNode(true)); // Clonamos el div original al contenedor A4

    // Asegurarse de que el contenedor se inserte en el DOM temporalmente para su procesamiento
    document.body.appendChild(a4Container);

    // Generar el PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    html2canvas(a4Container, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      // Añadir la imagen al PDF
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 277); // Ajusta 10 y 190 para los márgenes, el tamaño se adapta

      // Guardar el archivo PDF
      pdf.save('documento_a4.pdf');

      // Eliminar el contenedor A4 del DOM después de generar el PDF
      document.body.removeChild(a4Container);
    });
  }

  generarPDF(): void {
    const a4Container = document.getElementById('Representantespdf');  // Obtener el div que quieres convertir a PDF

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

        // Guardar el PDF with un nombre
        pdf.save('documento_a4.pdf');
      });
    }
  }


  Desabilitacamposdespuesdeenvio() {
    this.editable = false;
    this.RepresentantesForm.disable()

    this.IdEstadoFormulario = 3;
    this.cdr.detectChanges(); //
  }

  ObtenerDivFormulario() {
    const DATA: any = document.getElementById('Representantespdf');

    return DATA;
  }


  onPaisesObligacionTributariaChange(index: number, selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.representantes.at(index).get('PaisesObligacionTributaria')?.setValue(paises);
  }

  onPaisesCuentasExtChange(index: number, selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.representantes.at(index).get('PaisesCuentasExt')?.setValue(paises);
  }

  onPaisesPoderCuentaExtranjeraChange(index: number, selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.representantes.at(index).get('PaisesPoderCuentaExtranjera')?.setValue(paises);
  }

  allowOnlyNumbersVinculo(event: KeyboardEvent, representanteIndex: number, vinculoIndex: number): void {
    const representanteForm = this.representantes.at(representanteIndex) as FormGroup;
    IdentificacionValidators.allowOnlyNumbersNested(event, representanteForm, 'Vinculosmas', vinculoIndex);
  }

  validateNumeroIdentificacionInputVinculo(event: any, representanteIndex: number, vinculoIndex: number): void {
    const representanteForm = this.representantes.at(representanteIndex) as FormGroup;
    IdentificacionValidators.validateNumeroIdentificacionInputNested(event, representanteForm, 'Vinculosmas', vinculoIndex);
  }

  allowOnlyNumbersInfoFamilia(event: KeyboardEvent, representanteIndex: number, familiaIndex: number): void {
    const representanteForm = this.representantes.at(representanteIndex) as FormGroup;
    IdentificacionValidators.allowOnlyNumbersNested(event, representanteForm, 'InfoFamiliaPep', familiaIndex);
  }
  validateNumeroIdentificacionInputInfoFamilia(event: any, representanteIndex: number, familiaIndex: number): void {
    const representanteForm = this.representantes.at(representanteIndex) as FormGroup;
    IdentificacionValidators.validateNumeroIdentificacionInputNested(event, representanteForm, 'InfoFamiliaPep', familiaIndex);
  }

  allowOnlyNumbersForPhone(event: KeyboardEvent): void {
    IdentificacionValidators.allowOnlyNumbersForPhone(event);
  }

  validatePhoneInput(event: any, control?: AbstractControl | null): void {
    IdentificacionValidators.validatePhoneInput(event, control);
  }

  /**
   * Limpia los valores de campos que no deberían tener validación
   * Este método se ejecuta cuando se detecta que un campo no debería ser requerido
   */
  private limpiarCamposNoRequeridos(): void {
    const representantesArray = this.RepresentantesForm.get('representantes') as FormArray;

    representantesArray.controls.forEach((representanteGroup: AbstractControl) => {
      const formGroup = representanteGroup as FormGroup;
      const vinculadoPep = formGroup.get('vinculadoPep')?.value;

      // Si no está vinculado a PEP, limpiar todos los campos relacionados
      if (vinculadoPep === '0' || vinculadoPep === 0) {
        const camposALimpiar = [
          'ManejaRecursos', 'CualesRecursos', 'PoderPolitico', 'RamaPoderPublico',
          'CargoPublico', 'CualCargoPublico', 'ObligacionTributaria', 'PaisesObligacionTributaria',
          'CuentasFinancierasExt', 'PaisesCuentasExt', 'TienePoderCuentaExtranjera',
          'PaisesPoderCuentaExtranjera', 'hasidoPep2', 'Tienevinculosmas5'
        ];

        camposALimpiar.forEach(campo => {
          const control = formGroup.get(campo);
          if (control) {
            control.clearValidators();
            // Limpiar valor dependiendo del tipo de control
            if (campo.includes('Paises')) {
              control.setValue([]);
            } else {
              control.setValue('');
            }
            control.updateValueAndValidity();
          }
        });
      }
    });
  }

  /**
   * Método para forzar la validación de todos los campos del formulario
   * Este método se puede usar para asegurarse de que todos los campos sean validados
   */
  validarTodosLosCampos(): void {
    const representantesArray = this.RepresentantesForm.get('representantes') as FormArray;

    representantesArray.controls.forEach((representanteGroup: AbstractControl) => {
      const formGroup = representanteGroup as FormGroup;

      // Marcar todos los controles como tocados para mostrar errores de validación
      Object.values(formGroup.controls).forEach(control => {
        if (control instanceof FormControl) {
          control.markAsTouched();
        } else if (control instanceof FormGroup) {
          this.marcarGrupoComoTocado(control);
        } else if (control instanceof FormArray) {
          control.controls.forEach(subControl => {
            if (subControl instanceof FormGroup) {
              this.marcarGrupoComoTocado(subControl);
            } else {
              subControl.markAsTouched();
            }
          });
        }
      });
    });
  }
}


