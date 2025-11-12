import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ServicioPrincipalService } from '../../Services/main.services';
import { TranslateService } from '@ngx-translate/core';
import { noSeleccionadoValidator } from '../../utils/validcliente/validacionOpcionales';
import { IdentificacionValidators } from '../../utils/identificacion-validators';

@Component({
  selector: 'app-junta-directiva',
  templateUrl: './junta-directiva.component.html',
  styleUrl: './junta-directiva.component.scss'
})
export class JuntaDirectivaComponent implements OnInit, AfterViewInit {
  Lang: string = 'es';
  datos: any;
  @Input() IdEstadoFormulario: number;
  @Input() IdFormulario: number;
  @Input() Listatiposolicitud: any[];
  @Input() ListaClaseTerceros: any[];
  @Input() ListaTipoDocumentos: any[];
  @Input() ListaSino: any[];
  @Input() ListaPaises: any[];
  @Input() ListaTamanoterceros: any[];
  @Input() ListaActividadesEco: any[];
  @Input() ListaCategoriaTerceros: any[];
  @Input() editable: boolean;

  documentosFiltrados: any[] = [];
  JuntaDirectiva: FormGroup;

  private originalValidators: { [key: string]: any } = {};

  isbolean: boolean = false;
  tabdespachos: boolean = true;
  tabdRepresentanteLegal: boolean = true;
  formulario: FormGroup;

  constructor(private fb: FormBuilder, private translate: TranslateService, private serviciocliente: ServicioPrincipalService, private cdr: ChangeDetectorRef) {


    this.translate.setDefaultLang('es');
    // Opcional: cargar el idioma basado en una preferencia del usuario
    this.Lang = localStorage.getItem('language') || 'es';
    this.translate.use(this.Lang);
    this.JuntaDirectiva = this.fb.group({
      TieneFigura: ['', [Validators.required]],
      Directivos: this.fb.array([], [Validators.required])
    });
    this.crearDirectivo();
    /* this.JuntaDirectiva.get('TieneFigura')?.valueChanges.subscribe(value => {
      this.actualizarValidadoresDirectivos(value);
    }); */
  }
  // Devuelve un FormGroup para un directivo
  crearDirectivo(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]],
      tipoDocumento: ['-1', Validators.required],
      NumeroIdentificacion: ['', Validators.required],
      Nacionalidad: ['-1', Validators.required],
      Telefono: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      Ciudad: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]],
      Direccion: ['', Validators.required],
      vinculadoPep: ['-1', Validators.required],
      ManejaRecursos: ['-1', Validators.required],
      CualesRecursos: ['', Validators.required],
      PoderPolitico: ['-1', Validators.required],
      RamaPoderPublico: ['', Validators.required],
      CargoPublico: ['-1', Validators.required],
      CualCargoPublico: ['', Validators.required],
      hasidoPep2: ['-1', Validators.required],
      cargosPublicos: this.fb.array([]),
      Tienevinculosmas5: ['-1', Validators.required],
      Vinculosmas: this.fb.array([]),
      InfoFamiliaPep: this.fb.array([]),
    });
  }


  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  actualizarValidadoresDirectivos(tieneFigura: string): void {
    const directivosControl = this.JuntaDirectiva.get('Directivos');
    if (tieneFigura === '0') {
      directivosControl?.clearValidators();
    } else {
      directivosControl?.setValidators([Validators.required]);
    }
    directivosControl?.updateValueAndValidity();
  }




  ngOnInit(): void {

    this.JuntaDirectiva = this.fb.group({
      TieneFigura: ['', [Validators.required, noSeleccionadoValidator()]],
      Directivos: this.fb.array([], [Validators.required])
    });
    this.ConsultaInfoJuntaDirectiva()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['IdEstadoFormulario']) {
      // Aquí puedes manejar el cambio según sea necesario
    }
    this.documentosFiltrados = this.ListaTipoDocumentos.filter(tipo => tipo.id !== '3');
  }

  Desabilitacamposdespuesdeenvio() {
    this.editable = false;
    this.JuntaDirectiva.disable()

    this.IdEstadoFormulario = 3;

    this.cdr.detectChanges(); //
  }

  allowOnlyLetters(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', ' '];
    if (allowedKeys.includes(event.key)) return;

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]$/.test(event.key)) {
      event.preventDefault();
    }
  }
  ConsultaInfoJuntaDirectiva() {
    this.serviciocliente.cosultaJuntaDirectiva(this.IdFormulario).subscribe(data => {

      if (data) {
        console.log('juntadirectiva : ', data);
        this.setJuntaDirectiva(data.Directivos);
        this.JuntaDirectiva.patchValue({
          TieneFigura: data.TieneFigura.toString()
        });
        this.actualizarValidadoresDirectivos(data.TieneFigura.toString());
      }

      if (!this.editable) {
        this.JuntaDirectiva.disable();
      }


    });
  }


  limpiarControles(controles: string[]) {
    for (const control of controles) {
      this.directivo.get(control)?.setValue('');
    }
  }


  setJuntaDirectiva(directivos: any[]) {
    const control = this.JuntaDirectiva.get('Directivos') as FormArray;
    control.clear();

    directivos.forEach((d: any) => {
      const directivoGroup = this.fb.group({
        nombre: [d.nombre],
        tipoDocumento: [d.tipoDocumento],
        NumeroIdentificacion: [d.NumeroIdentificacion],
        Nacionalidad: [d.Nacionalidad],
        vinculadoPep: [d.vinculadoPep],
        Telefono: [d.Telefono],
        Ciudad: [d.Ciudad],
        Direccion: [d.Direccion],
        ManejaRecursos: [d.ManejaRecursos],
        CualesRecursos: [d.CualesRecursos],
        PoderPolitico: [d.PoderPolitico],
        RamaPoderPublico: [d.RamaPoderPublico],
        CargoPublico: [d.CargoPublico],
        CualCargoPublico: [d.CualCargoPublico],
        hasidoPep2: [d.hasidoPep2],
        cargosPublicos: this.fb.array([]),
        Tienevinculosmas5: [d.Tienevinculosmas5],
        Vinculosmas: this.fb.array([]),
        InfoFamiliaPep: this.fb.array([])
      });

      // Llenar cargosPublicos si existen
      if (d.cargosPublicos && d.cargosPublicos.length > 0) {
        const cargosArray = directivoGroup.get('cargosPublicos') as FormArray;
        d.cargosPublicos.forEach((c: any) => {
          cargosArray.push(this.fb.group({
            NombreEntidad: [c.NombreEntidad],
            FechaIngreso: [c.FechaIngreso],
            FechaDesvinculacion: [c.FechaDesvinculacion]
          }));
        });
      }

      // Llenar InfoFamiliaPep si existen
      if (d.InfoFamiliaPep && d.InfoFamiliaPep.length > 0) {
        const familiaArray = directivoGroup.get('InfoFamiliaPep') as FormArray;
        d.InfoFamiliaPep.forEach((f: any) => {
          familiaArray.push(this.fb.group({
            NombreCompleto: [f.NombreCompleto],
            TipoIdentificacion: [f.TipoIdentificacion],
            NumeroIdentificacion: [f.NumeroIdentificacion],
            CargoContacto: [f.CargoContacto],
            Nacionalidad: [f.Nacionalidad],
            VinculoFamiliar: [f.VinculoFamiliar],
            UltimoCargo: [f.UltimoCargo],
            FechaNombramiento: [f.FechaNombramiento],
            FechaFinalizacion: [f.FechaFinalizacion]
          }));
        });
      }

      control.push(directivoGroup);
    });
  }



  private ajustarValidacionesotroscampos(formGroup: FormGroup, representante: any): void {
    if (representante.ManejaRecursos === '0' || representante.ManejaRecursos === '-1') {
      formGroup.get('CualesRecursos')?.clearValidators();
    } else {
      formGroup.get('CualesRecursos')?.setValidators([Validators.required]);
    }
    if (representante.PoderPolitico === '0' || representante.PoderPolitico === '-1') {
      formGroup.get('RamaPoderPublico')?.clearValidators();
    } else {
      formGroup.get('RamaPoderPublico')?.setValidators([Validators.required]);
    }
    if (representante.CargoPublico === '0' || representante.CargoPublico === '-1') {
      formGroup.get('CualCargoPublico')?.clearValidators();
    } else {
      formGroup.get('CualCargoPublico')?.setValidators([Validators.required]);
    }

    formGroup.get('CualesRecursos')?.updateValueAndValidity();
    formGroup.get('RamaPoderPublico')?.updateValueAndValidity();
    formGroup.get('CualCargoPublico')?.updateValueAndValidity();
  }

  private ajustarValidaciones(formGroup: FormGroup, vinculadoPepValue: string): void {
    const campos = [
      'ManejaRecursos', 'CualesRecursos', 'PoderPolitico', 'RamaPoderPublico',
      'CargoPublico', 'CualCargoPublico', 'Tienevinculosmas5',
      'InfoFamiliaPep'
    ];

    if (vinculadoPepValue === '0') {
      campos.forEach(campo => {
        formGroup.get(campo)?.clearValidators();
      });
    } else {
      campos.forEach(campo => {
        formGroup.get(campo)?.setValidators([Validators.required]);
      });
    }

    campos.forEach(campo => {
      formGroup.get(campo)?.updateValueAndValidity();
    });
  }


  crearcargospublicosForm(cargo?: any): FormGroup {
    return this.fb.group({
      NombreEntidad: [cargo?.NombreEntidad || '', Validators.required],
      FechaIngreso: [cargo?.FechaIngreso || '', Validators.required],
      FechaDesvinculacion: [cargo?.FechaDesvinculacion || ''],
    });
  }

  crearVinculoForm(vinculo?: any): FormGroup {
    return this.fb.group({
      NombreCompleto: [vinculo?.NombreCompleto || '', Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)],
      TipoIdentificacion: [vinculo?.TipoIdentificacion || '-1', [Validators.required, noSeleccionadoValidator()]],
      NumeroIdentificacion: [vinculo?.NumeroIdentificacion || '', Validators.required],
      Pais: [vinculo?.Pais || '', [Validators.required, noSeleccionadoValidator()]],
      PorcentajeParticipacion: [vinculo?.PorcentajeParticipacion || '', Validators.required],
    });
  }

  crearInfoFamiliaForm(infoFamilia?: any): FormGroup {
    return this.fb.group({
      NombreCompleto: [infoFamilia?.NombreCompleto || '', Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)],
      TipoIdentificacion: [infoFamilia?.TipoIdentificacion || '-1', [Validators.required, noSeleccionadoValidator()]],
      NumeroIdentificacion: [infoFamilia?.NumeroIdentificacion || '', Validators.required],
      Nacionalidad: [infoFamilia?.Nacionalidad || '-1', [Validators.required, noSeleccionadoValidator()]],
      CargoContacto: [infoFamilia?.CargoContacto || '', Validators.required],
      FechaNombramiento: [infoFamilia?.FechaNombramiento || '', Validators.required],
      FechaFinalizacion: [infoFamilia?.FechaFinalizacion || '', Validators.required],
      VinculoFamiliar: [infoFamilia?.VinculoFamiliar || '', Validators.required],
    });
  }


  // Método para enviar el formulario
  enviarFormulario(): void {
    if (this.formulario.valid) {

    } else {
      this.formulario.markAllAsTouched();
    }
  }

  get directivo() {
    return this.JuntaDirectiva.get('Directivos') as FormArray;
  }
  // Agregar un nuevo representante
  addRepresentante() {
    const representanteForm = this.crearRepresentante();
    this.directivo.push(representanteForm);

    // Configurar validación para el representante principal
    IdentificacionValidators.setupIdentificacionValidationForFormGroup(
      representanteForm,
      'tipoDocumento',
      'NumeroIdentificacion'
    );

    // Configurar validación para FormArrays anidados (aunque inicialmente estén vacíos)
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
      if (value !== '1') {
        representanteForm.get('CualesRecursos')?.clearValidators();
      } else {
        representanteForm.get('CualesRecursos')?.setValidators([Validators.required]);
      }
      representanteForm.get('CualesRecursos')?.updateValueAndValidity();
    });
    representanteForm.get('PoderPolitico')?.valueChanges.subscribe(value => {
      if (value !== '1') {
        representanteForm.get('RamaPoderPublico')?.clearValidators();
      } else {
        representanteForm.get('RamaPoderPublico')?.setValidators([Validators.required]);
      }
      representanteForm.get('RamaPoderPublico')?.updateValueAndValidity();
    });
    representanteForm.get('CargoPublico')?.valueChanges.subscribe(value => {
      if (value !== '1') {
        representanteForm.get('CualCargoPublico')?.clearValidators();
      } else {
        representanteForm.get('CualCargoPublico')?.setValidators([Validators.required]);
      }
      representanteForm.get('CualCargoPublico')?.updateValueAndValidity();
    });
    representanteForm.get('hasidoPep2')?.valueChanges.subscribe(value => {
      this.initializeFormSubscriptionsCargos(representanteForm, value);
    });
    representanteForm.get('Tienevinculosmas5')?.valueChanges.subscribe(value => {
      this.initializeFormSubsvinculadosmas5(representanteForm, value);
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
      representanteForm.get('hasidoPep2')?.clearValidators();
      representanteForm.get('Tienevinculosmas5')?.clearValidators();
      representanteForm.get('InfoFamiliaPep')?.clearValidators();
    } else {
      representanteForm.get('ManejaRecursos')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('CualesRecursos')?.setValidators([Validators.required]);
      representanteForm.get('PoderPolitico')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('RamaPoderPublico')?.setValidators([Validators.required]);
      representanteForm.get('CargoPublico')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('CualCargoPublico')?.setValidators([Validators.required]);
      representanteForm.get('hasidoPep2')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('Tienevinculosmas5')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('InfoFamiliaPep')?.setValidators([Validators.required]);
    }

    representanteForm.get('ManejaRecursos')?.updateValueAndValidity();
    representanteForm.get('CualesRecursos')?.updateValueAndValidity();
    representanteForm.get('PoderPolitico')?.updateValueAndValidity();
    representanteForm.get('RamaPoderPublico')?.updateValueAndValidity();
    representanteForm.get('CargoPublico')?.updateValueAndValidity();
    representanteForm.get('CualCargoPublico')?.updateValueAndValidity();
    representanteForm.get('hasidoPep2')?.updateValueAndValidity();
    representanteForm.get('Tienevinculosmas5')?.updateValueAndValidity();
    representanteForm.get('InfoFamiliaPep')?.updateValueAndValidity();
  }


  private initializeFormSubscriptionsCargos(representanteForm: FormGroup, value: any) {
    if (value !== '1') {
      representanteForm.get('cargosPublicos')?.clearValidators();
    } else {
      representanteForm.get('cargosPublicos')?.setValidators([Validators.required]);
    }
    representanteForm.get('cargosPublicos')?.updateValueAndValidity();
  }

  private initializeFormSubsvinculadosmas5(representanteForm: FormGroup, value: any) {
    if (value !== '1') {
      representanteForm.get('Vinculosmas')?.clearValidators();
    } else {
      representanteForm.get('Vinculosmas')?.setValidators([Validators.required]);
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

    // Aquí puedes restablecer los controles a su estado inicial
    representanteForm.patchValue({
      ManejaRecursos: '-1',
      CualesRecursos: '',
      PoderPolitico: '-1',
      RamaPoderPublico: '',
      CargoPublico: '-1',
      CualCargoPublico: '',
      hasidoPep2: '-1',
      Tienevinculosmas5: '-1',
      // ... restablece otros controles según sea necesario
    });
  }

  // Quitar representante
  removeRepresentante(index: number) {
    this.directivo.removeAt(index);
  }

  // Crear el grupo de un representante, incluyendo el array de cargos públicos
  crearRepresentante(): FormGroup {
    return this.fb.group({
      nombre: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]
      ],
      tipoDocumento: ['-1', [Validators.required, noSeleccionadoValidator()]],
      NumeroIdentificacion: ['', Validators.required],
      Nacionalidad: ['-1', [Validators.required, noSeleccionadoValidator()]],
      vinculadoPep: ['-1', [Validators.required, noSeleccionadoValidator()]],
      ManejaRecursos: ['-1', [Validators.required, noSeleccionadoValidator()]],
      Telefono: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      Ciudad: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]],
      Direccion: ['', Validators.required],
      CualesRecursos: ['', Validators.required],
      PoderPolitico: ['-1', [Validators.required, noSeleccionadoValidator()]],
      RamaPoderPublico: ['', Validators.required],

      CargoPublico: ['-1', [Validators.required, noSeleccionadoValidator()]],
      CualCargoPublico: ['', Validators.required],

      hasidoPep2: ['-1', [Validators.required, noSeleccionadoValidator()]],
      cargosPublicos: this.fb.array([]),

      Tienevinculosmas5: ['-1', [Validators.required, noSeleccionadoValidator()]],
      Vinculosmas: this.fb.array([]),

      InfoFamiliaPep: this.fb.array([], Validators.required),
      //cargosPublicos: this.fb.array([this.crearcargospublicos()]) // Array de ca// Array de cargos públicos
    });
  }

  // Obtener el FormArray de cargos públicos para un representante específico
  getCargosPublicos(representanteIndex: number): FormArray {
    return this.directivo.at(representanteIndex).get('cargosPublicos') as FormArray;
  }


  crearcargospublicos() {
    return this.fb.group({
      NombreEntidad: ['', Validators.required],
      FechaIngreso: ['', Validators.required],
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
      NombreEntidad: ['', Validators.required],
      FechaIngreso: ['', Validators.required],
      FechaDesvinculacion: [''],

    });
    cargosPublicos.push(cargoPublicoForm);
  }
  addVinculomas5(representanteIndex: number) {
    const vinculosmas5 = this.getVinculomas5(representanteIndex);
    const vinculosmas5Form = this.fb.group({
      NombreCompleto: ['', Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)],
      TipoIdentificacion: ['-1', [Validators.required, noSeleccionadoValidator()]],
      NumeroIdentificacion: ['', Validators.required],
      Pais: ['-1', [Validators.required, noSeleccionadoValidator()]],
      PorcentajeParticipacion: ['', Validators.required],
    });

    // Configurar validación de identificación para el nuevo elemento
    IdentificacionValidators.setupIdentificacionValidationForFormGroup(
      vinculosmas5Form,
      'TipoIdentificacion',
      'NumeroIdentificacion'
    );

    vinculosmas5.push(vinculosmas5Form);
  }

  getVinculomas5(vinculomas5Index: number): FormArray {
    return this.directivo.at(vinculomas5Index).get('Vinculosmas') as FormArray;
  }


  getInfoFamiliar(indofamiliarIndex: number): FormArray {
    return this.directivo.at(indofamiliarIndex).get('InfoFamiliaPep') as FormArray;
  }
  addInfoFamilia(representanteIndex: number) {
    const InfoFamilia = this.getInfoFamiliar(representanteIndex);
    const InfoFamiliaForm = this.fb.group({
      NombreCompleto: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]],
      TipoIdentificacion: ['-1', [Validators.required, noSeleccionadoValidator()]],
      NumeroIdentificacion: ['', Validators.required],
      Nacionalidad: ['-1', [Validators.required, noSeleccionadoValidator()]],
      CargoContacto: ['', Validators.required],
      FechaNombramiento: ['', Validators.required],
      FechaFinalizacion: ['', Validators.required],
      VinculoFamiliar: ['', Validators.required],
    });

    // Configurar validación de identificación para el nuevo elemento
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
        'Tienevinculosmas5'
      ];

      if (value === '0') {
        fields.forEach(field => {
          representanteForm.get(field)?.clearValidators();
          representanteForm.get(field)?.updateValueAndValidity();
        });
      } else {
        fields.forEach(field => {
          representanteForm.get(field)?.setValidators(Validators.required);
          representanteForm.get(field)?.updateValueAndValidity();
        });
      }
    });
  }

  obtenerCamposInvalidos(): any[] {
    const invalidFields: any[] = [];

    // Recorre el FormArray de representantes
    (this.directivo.controls as FormGroup[]).forEach((representanteGroup, representanteIndex) => {
      // Verifica cada control en el FormGroup del representante
      Object.keys((representanteGroup as FormGroup).controls).forEach(field => {
        const control = representanteGroup.get(field);

        if (control && control.invalid) {
          invalidFields.push({
            representanteIndex,
            field,
            errors: control.errors
          });
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

    const formValue = this.JuntaDirectiva.value;

    this.marcarFormularioComoTocado();

  }
  marcarFormularioComoTocado() {
    Object.values(this.JuntaDirectiva.controls).forEach(control => {
      if (control instanceof FormControl) {

        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {

        this.marcarGrupoComoTocado(control);
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
      this.JuntaDirectiva.markAllAsTouched();
    }
    const formularioValores = this.JuntaDirectiva.value;
    return formularioValores;
  }
  esFormularioValido(): boolean {
    // Fuerza Angular a recalcular y mostrar errores
    this.JuntaDirectiva.markAllAsTouched();
    this.JuntaDirectiva.updateValueAndValidity({ emitEvent: false });

    // Devuelve true o false según validez
    return this.JuntaDirectiva.valid;
  }

  // get valor tieneFigura
  getTieneFiguraValue(): string {
    return this.JuntaDirectiva.get('TieneFigura')?.value || '-1';
  }

  ObtenerDivFormulario() {
    const DATA: any = document.getElementById('JuntaDirDiv');

    return DATA;
  }


  allowOnlyNumbers(event: KeyboardEvent, directivoIndex: number): void {
    const directivoForm = this.directivo.at(directivoIndex) as FormGroup;
    const tipoId = directivoForm.get('tipoDocumento')?.value;
    IdentificacionValidators.allowOnlyNumbers(event, tipoId);
  }


  validateNumeroIdentificacionInput(event: any, directivoIndex: number): void {
    const directivoForm = this.directivo.at(directivoIndex) as FormGroup;
    const tipoId = directivoForm.get('tipoDocumento')?.value;
    const control = directivoForm.get('NumeroIdentificacion');
    IdentificacionValidators.validateNumeroIdentificacionInput(event, tipoId, control);
  }

  allowOnlyNumbersVinculo(event: KeyboardEvent, directivoIndex: number, vinculoIndex: number): void {
    const directivoForm = this.directivo.at(directivoIndex) as FormGroup;
    IdentificacionValidators.allowOnlyNumbersNested(event, directivoForm, 'Vinculosmas', vinculoIndex);
  }

  validateNumeroIdentificacionInputVinculo(event: any, directivoIndex: number, vinculoIndex: number): void {
    const directivoForm = this.directivo.at(directivoIndex) as FormGroup;
    IdentificacionValidators.validateNumeroIdentificacionInputNested(event, directivoForm, 'Vinculosmas', vinculoIndex);
  }

  allowOnlyNumbersInfoFamilia(event: KeyboardEvent, directivoIndex: number, familiaIndex: number): void {
    const directivoForm = this.directivo.at(directivoIndex) as FormGroup;
    IdentificacionValidators.allowOnlyNumbersNested(event, directivoForm, 'InfoFamiliaPep', familiaIndex);
  }
  validateNumeroIdentificacionInputInfoFamilia(event: any, directivoIndex: number, familiaIndex: number): void {
    const directivoForm = this.directivo.at(directivoIndex) as FormGroup;
    IdentificacionValidators.validateNumeroIdentificacionInputNested(event, directivoForm, 'InfoFamiliaPep', familiaIndex);
  }

  // Métodos de validación de teléfono
  allowOnlyNumbersForPhone(event: KeyboardEvent): void {
    IdentificacionValidators.allowOnlyNumbersForPhone(event);
  }

  validatePhoneInput(event: any, control?: AbstractControl | null): void {
    IdentificacionValidators.validatePhoneInput(event, control);
  }
}


