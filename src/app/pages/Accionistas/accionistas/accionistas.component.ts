import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ServicioPrincipalService } from '../../Services/main.services';
import { TranslateService } from '@ngx-translate/core';
import { BeneficiarioFinalComponent } from '../../BeneficiarioFinal/beneficiario-final/beneficiario-final.component';
import { noSeleccionadoValidator } from '../../utils/validcliente/validacionOpcionales';
import { IdentificacionValidators } from '../../utils/identificacion-validators';

@Component({
  selector: 'app-accionistas',
  templateUrl: './accionistas.component.html',
  styleUrl: './accionistas.component.scss'
})
export class AccionistasComponent implements OnInit {

  Lang: string = 'es';
  @ViewChildren(BeneficiarioFinalComponent) beneficiarioFinalComponents: QueryList<BeneficiarioFinalComponent>;
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
  Accionistas: FormGroup;

  private originalValidators: { [key: string]: any } = {};



  constructor(
    private fb: FormBuilder,
    private serviciocliente: ServicioPrincipalService,
    private translate: TranslateService, private cdr: ChangeDetectorRef
  ) {
    this.translate.setDefaultLang('es');
    this.Lang = localStorage.getItem('language') || 'es';
    this.translate.use(this.Lang);
    this.Accionistas = this.fb.group({
      TieneFigura: ['', [Validators.required, noSeleccionadoValidator()]],
      Accionista: this.fb.array([], Validators.required)
    });

    this.Accionistas.get('TieneFigura')?.valueChanges.subscribe(value => {
      this.actualizarValidadoresDirectivos(value);

      // si por ejemplo '0' = No tiene figura, vacía todos los accionistas
      if (value === '0') {
        this.removerTodosLosAccionistas();
      }
    });
  }

  actualizarValidadoresDirectivos(tieneFigura: string): void {
    const directivosControl = this.Accionistas.get('Accionista');
    if (tieneFigura === '0') {
      directivosControl?.clearValidators();
    } else {
      directivosControl?.setValidators([Validators.required]);
    }
    directivosControl?.updateValueAndValidity();
  }


  getBeneficiariosFinales(index: number): any[] {
    const accionistaControl = this.accionistaArray.at(index).get('BeneficiariosFinales') as FormArray;

    if (accionistaControl) {
      const beneficiarios = accionistaControl.controls.map((control: AbstractControl) => {
        return (control as FormGroup).value;
      });
      return beneficiarios;
    }

    return [];
  }


  Desabilitacamposdespuesdeenvio() {
    this.editable = false;
    this.Accionistas.disable()
    if (this.beneficiarioFinalComponents && this.beneficiarioFinalComponents.length > 0) {
      this.beneficiarioFinalComponents.forEach(component => {
        component.Desabilitacamposdespuesdeenvio();
        component.IdEstadoFormulario = 3;
      });
    }

    this.IdEstadoFormulario = 3;

    this.cdr.detectChanges(); //


  }


  ngOnInit(): void {

    /*     Object.keys(this.Accionistas.controls).forEach(key => {
          const control = this.Accionistas.get(key);
          this.originalValidators[key] = control?.validator;
        }); */

    if (this.IdFormulario !== 0 && this.IdFormulario !== undefined) {
      this.ConsultaAccionistas();
    }
  }

  verificarSiFormularioEnviado(): boolean {

    return true;
  }

  deshabilitarFormulario(form: FormGroup): void {
    Object.keys(form.controls).forEach(controlName => {
      const control = form.get(controlName);
      if (control instanceof FormGroup) {
        this.deshabilitarFormulario(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((arrayControl: AbstractControl) => {
          if (arrayControl instanceof FormGroup) {
            this.deshabilitarFormulario(arrayControl);
          } else {
            arrayControl.disable();
          }
        });
      } else {
        control?.disable();
      }
    });
  }




  ConsultaAccionistas(): void {
    this.serviciocliente.cosultaAccionistas(this.IdFormulario).subscribe((data: any) => {
      console.log('acciionista:' ,this.Accionistas.get('TieneFigura'));
      this.Accionistas.get('TieneFigura')?.setValue(
        (data.TieneFigura ?? '0').toString()
      );
      if (!data) return;

      // Limpiar FormArray principal
      this.accionista.clear();

      // Llenar FormArray principal con accionistas
      (data.Accionista as any[]).forEach((a: any) => {
        const accionistaFG = this.fb.group({
          NombreCompleto: [a.NombreCompleto || '', Validators.required],
          tipoDocumento: [a.tipoDocumento || -1, Validators.required],
          NumeroIdentificacion: [a.NumeroIdentificacion || '', Validators.required],
          Nacionalidad: [a.Nacionalidad || -1, Validators.required],
          Domicilio: [a.Domicilio || '', Validators.required],
          Porcentajeparticipacion: [a.Porcentajeparticipacion || 0, [Validators.required]],
          CotizaEnBolsa: [a.CotizaEnBolsa || -1],
          vinculadoPep: [a.vinculadoPep || -1],
          ManejaRecursos: [a.ManejaRecursos || -1],
          CualesRecursos: [a.CualesRecursos || ''],
          PoderPolitico: [a.PoderPolitico || -1],
          RamaPoderPublico: [a.RamaPoderPublico || ''],
          CargoPublico: [a.CargoPublico || -1],
          CualCargoPublico: [a.CualCargoPublico || ''],
          hasidoPep2: [a.hasidoPep2 || -1],
          cargosPublicos: this.fb.array([]),
          Vinculosmas: this.fb.array([]),
          InfoFamiliaPep: this.fb.array([])
        });

        // Llenar cargos públicos
        if (a.cargosPublicos && Array.isArray(a.cargosPublicos)) {
          const cargosArray = accionistaFG.get('cargosPublicos') as FormArray;
          a.cargosPublicos.forEach((c: any) => {
            cargosArray.push(this.fb.group({
              NombreEntidad: [c.NombreEntidad || '', Validators.required],
              FechaIngreso: [c.FechaIngreso || '', Validators.required],
              FechaDesvinculacion: [c.FechaDesvinculacion || '']
            }));
          });
        }

        // Llenar vínculos
        if (a.Vinculosmas && Array.isArray(a.Vinculosmas)) {
          const vinculosArray = accionistaFG.get('Vinculosmas') as FormArray;
          a.Vinculosmas.forEach((v: any) => {
            vinculosArray.push(this.fb.group({
              NombreCompleto: [v.NombreCompleto || '', Validators.required],
              TipoIdentificacion: [v.TipoIdentificacion || -1, Validators.required],
              NumeroIdentificacion: [v.NumeroIdentificacion || '', Validators.required],
              Pais: [v.Pais || -1, Validators.required],
              PorcentajeParticipacion: [v.PorcentajeParticipacion || '', Validators.required]
            }));
          });
        }

        // Llenar info familiar (asociados cercanos)
        if (a.InfoFamiliaPep && Array.isArray(a.InfoFamiliaPep)) {
          const familiaArray = accionistaFG.get('InfoFamiliaPep') as FormArray;
          a.InfoFamiliaPep.forEach((f: any) => {
            familiaArray.push(this.fb.group({
              NombreCompleto: [f.NombreCompleto || '', Validators.required],
              TipoIdentificacion: [f.TipoIdentificacion || -1, Validators.required],
              NumeroIdentificacion: [f.NumeroIdentificacion || '', Validators.required],
              Nacionalidad: [f.Nacionalidad || -1, Validators.required],
              CargoContacto: [f.CargoContacto || '', Validators.required],
              VinculoFamiliar: [f.VinculoFamiliar || '', Validators.required],
              FechaNombramiento: [f.FechaNombramiento || '', Validators.required],
              FechaFinalizacion: [f.FechaFinalizacion || '', Validators.required]
            }));
          });
        }

        // Agregar el FormGroup al FormArray principal
        this.accionista.push(accionistaFG);
      });

      this.actualizarValidadoresDirectivos(data.TieneFigura?.toString() || '0');

      if (!this.editable) {
        this.Accionistas.disable();
      }
    });
  }



  get accionistaArray(): FormArray {
    return this.Accionistas.get('Accionista') as FormArray;
  }

  get accionista(): FormArray {
    return this.Accionistas.get('Accionista') as FormArray;
  }

  addAccionista() {
    const representanteForm = this.crearAccionista();
    this.accionista.push(representanteForm);

    // config accionista principal
    IdentificacionValidators.setupIdentificacionValidationForFormGroup(
      representanteForm,
      'tipoDocumento',
      'NumeroIdentificacion'
    );

    this.setupCotizaEnBolsaValidation(representanteForm);

    // config para los formsarrays
    IdentificacionValidators.configureMultipleNestedFormArrays(representanteForm, [
      { arrayName: 'Vinculosmas', tipoDocField: 'TipoIdentificacion', numeroIdField: 'NumeroIdentificacion' },
      { arrayName: 'InfoFamiliaPep', tipoDocField: 'TipoIdentificacion', numeroIdField: 'NumeroIdentificacion' }
    ]);

    this.listenVinculadoPep(representanteForm);


    representanteForm.get('tipoDocumento')?.valueChanges.subscribe(value => {
      if (value === '3') {
        this.resetControls2(representanteForm);
        this.inicializaControlessiesPersonaJuridica(representanteForm);
      }

    });


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
    representanteForm.get('ObligacionTributaria')?.valueChanges.subscribe(value => {
      if (value !== '1') {
        representanteForm.get('PaisesObligacionTributaria')?.clearValidators();
        representanteForm.get('PaisesObligacionTributaria')?.setValue([]);
      } else {
        representanteForm.get('PaisesObligacionTributaria')?.setValidators([Validators.required]);
      }
      representanteForm.get('PaisesObligacionTributaria')?.updateValueAndValidity();
    });
    representanteForm.get('CuentasFinancierasExt')?.valueChanges.subscribe(value => {
      if (value !== '1') {
        representanteForm.get('PaisesCuentasExt')?.clearValidators();
        representanteForm.get('PaisesCuentasExt')?.setValue([]);
      } else {
        representanteForm.get('PaisesCuentasExt')?.setValidators([Validators.required]);
      }
      representanteForm.get('PaisesCuentasExt')?.updateValueAndValidity();
    });
    representanteForm.get('TienePoderCuentaExtranjera')?.valueChanges.subscribe(value => {
      if (value !== '1') {
        representanteForm.get('PaisesPoderCuentaExtranjera')?.clearValidators();
        representanteForm.get('PaisesPoderCuentaExtranjera')?.setValue([]);
      } else {
        representanteForm.get('PaisesPoderCuentaExtranjera')?.setValidators([Validators.required]);
      }
      representanteForm.get('PaisesPoderCuentaExtranjera')?.updateValueAndValidity();
    });

    representanteForm.get('tipoDocumento')?.valueChanges.subscribe(value => {
      if (value === '3') {
        this.resetControls2(representanteForm);
        this.inicializaControlessiesPersonaJuridica(representanteForm);
        representanteForm.get('CotizaEnBolsa')?.setValidators([Validators.required, noSeleccionadoValidator()]);
        representanteForm.get('CotizaEnBolsa')?.updateValueAndValidity();

      } else {
        representanteForm.get('CotizaEnBolsa')?.clearValidators();
        representanteForm.get('CotizaEnBolsa')?.setValue('-1');
        representanteForm.get('CotizaEnBolsa')?.updateValueAndValidity();
      }
    });

    const porcentajeControl = representanteForm.get('Porcentajeparticipacion');
    porcentajeControl?.valueChanges.subscribe(() => {
      this.accionistaArray.controls.forEach(c => {
        c.get('Porcentajeparticipacion')?.updateValueAndValidity({ emitEvent: false });
      });
    });

  }

  private removerTodosLosAccionistas(): void {
    // recorrer al revés para que los índices no se desplacen
    for (let i = this.accionista.length - 1; i >= 0; i--) {
      this.removeAccionista(i);
    }
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

  resetControls2(representanteForm: FormGroup) {
    const cargosPublicosArray = representanteForm.get('cargosPublicos') as FormArray;
    cargosPublicosArray.clear();
    const vinculosMasArray = representanteForm.get('Vinculosmas') as FormArray;
    vinculosMasArray.clear();
    const infoFamiliaPepArray = representanteForm.get('InfoFamiliaPep') as FormArray;
    infoFamiliaPepArray.clear();
    representanteForm.patchValue({
      vinculadoPep: '-1',
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
          representanteForm.get(field)?.setValidators(Validators.required);
          representanteForm.get(field)?.updateValueAndValidity();
        });
      }
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
      representanteForm.get('CuentasFinancierasExt')?.clearValidators();
      representanteForm.get('TienePoderCuentaExtranjera')?.clearValidators();
      representanteForm.get('hasidoPep2')?.clearValidators();
      representanteForm.get('Tienevinculosmas5')?.clearValidators();
      representanteForm.get('InfoFamiliaPep')?.clearValidators();
    } else {
      representanteForm.get('ManejaRecursos')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('CualesRecursos')?.setValidators([Validators.required]);
      representanteForm.get('PoderPolitico')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('RamaPoderPublico')?.setValidators([Validators.required]);
      representanteForm.get('CargoPublico')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('ObligacionTributaria')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('CuentasFinancierasExt')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('TienePoderCuentaExtranjera')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('hasidoPep2')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('Tienevinculosmas5')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('InfoFamiliaPep')?.setValidators([Validators.required]);
    }

    representanteForm.get('ManejaRecursos')?.updateValueAndValidity();
    representanteForm.get('CualesRecursos')?.updateValueAndValidity();
    representanteForm.get('PoderPolitico')?.updateValueAndValidity();
    representanteForm.get('RamaPoderPublico')?.updateValueAndValidity();
    representanteForm.get('CualCargoPublico')?.updateValueAndValidity();
    representanteForm.get('ObligacionTributaria')?.updateValueAndValidity();
    representanteForm.get('CuentasFinancierasExt')?.updateValueAndValidity();
    representanteForm.get('TienePoderCuentaExtranjera')?.updateValueAndValidity();
    representanteForm.get('hasidoPep2')?.updateValueAndValidity();
    representanteForm.get('Tienevinculosmas5')?.updateValueAndValidity();
    representanteForm.get('InfoFamiliaPep')?.updateValueAndValidity();
  }

  private inicializaControlessiesPersonaJuridica(representanteForm: FormGroup) {
    representanteForm.get('vinculadoPep')?.clearValidators();
    representanteForm.get('ManejaRecursos')?.clearValidators();
    representanteForm.get('CualesRecursos')?.clearValidators();
    representanteForm.get('PoderPolitico')?.clearValidators();
    representanteForm.get('RamaPoderPublico')?.clearValidators();
    representanteForm.get('CargoPublico')?.clearValidators();
    representanteForm.get('CualCargoPublico')?.clearValidators();
    representanteForm.get('ObligacionTributaria')?.clearValidators();
    representanteForm.get('CuentasFinancierasExt')?.clearValidators();
    representanteForm.get('TienePoderCuentaExtranjera')?.clearValidators();
    representanteForm.get('PaisesPoderCuentaExtranjera')?.clearValidators();
    representanteForm.get('hasidoPep2')?.clearValidators();
    representanteForm.get('Tienevinculosmas5')?.clearValidators();
    representanteForm.get('InfoFamiliaPep')?.clearValidators();

    representanteForm.get('vinculadoPep')?.updateValueAndValidity();
    representanteForm.get('ManejaRecursos')?.updateValueAndValidity();
    representanteForm.get('CualesRecursos')?.updateValueAndValidity();
    representanteForm.get('PoderPolitico')?.updateValueAndValidity();
    representanteForm.get('RamaPoderPublico')?.updateValueAndValidity();
    representanteForm.get('CualCargoPublico')?.updateValueAndValidity();
    representanteForm.get('ObligacionTributaria')?.updateValueAndValidity();
    representanteForm.get('CuentasFinancierasExt')?.updateValueAndValidity();
    representanteForm.get('TienePoderCuentaExtranjera')?.updateValueAndValidity();
    representanteForm.get('PaisesPoderCuentaExtranjera')?.updateValueAndValidity();
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


  removeAccionista(index: number) {
    this.accionista.removeAt(index);
  }

  crearAccionista(): FormGroup {
    return this.fb.group({
      NombreCompleto: ['', Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)],
      tipoDocumento: ['-1', [Validators.required, noSeleccionadoValidator()]],
      NumeroIdentificacion: ['', Validators.required],
      Nacionalidad: ['-1', [Validators.required, noSeleccionadoValidator()]],
      Porcentajeparticipacion: ['', [Validators.required, this.percentageValidator.bind(this)]],
      Domicilio: [''],
      vinculadoPep: ['-1', [Validators.required, noSeleccionadoValidator()]],
      ManejaRecursos: ['-1', [Validators.required, noSeleccionadoValidator()]],
      CualesRecursos: ['', Validators.required],
      PoderPolitico: ['-1', [Validators.required, noSeleccionadoValidator()]],
      RamaPoderPublico: ['', Validators.required],
      CargoPublico: ['-1', [Validators.required, noSeleccionadoValidator()]],
      CualCargoPublico: ['', Validators.required],
      ObligacionTributaria: ['-1', [Validators.required, noSeleccionadoValidator()]],
      PaisesObligacionTributaria: [],
      CuentasFinancierasExt: ['-1', [Validators.required, noSeleccionadoValidator()]],
      PaisesCuentasExt: [],
      TienePoderCuentaExtranjera: ['-1', [Validators.required, noSeleccionadoValidator()]],
      PaisesPoderCuentaExtranjera: [],
      hasidoPep2: ['-1', [Validators.required, noSeleccionadoValidator()]],
      cargosPublicos: this.fb.array([]),
      Tienevinculosmas5: ['-1', [Validators.required, noSeleccionadoValidator()]],
      Vinculosmas: this.fb.array([]),
      InfoFamiliaPep: this.fb.array([], Validators.required),
      BeneficiariosFinales: this.fb.array([]),
      CotizaEnBolsa: ['-1'],
      //cargosPublicos: this.fb.array([this.crearcargospublicos()]) // Array de ca// Array de cargos públicos
    });
  }

  actualizarBeneficiarioFinal(index: number, formularioBeneficiario: FormGroup) {
    const beneficiariosArray = this.accionista.at(index).get('BeneficiariosFinales') as FormArray;

    if (beneficiariosArray && formularioBeneficiario instanceof FormGroup) {
      const nuevoBeneficiarioArray = formularioBeneficiario.get('Beneficiario') as FormArray;

      if (nuevoBeneficiarioArray) {
        beneficiariosArray.clear();
        nuevoBeneficiarioArray.controls.forEach(control => {
          beneficiariosArray.push(control);
        });
      }
    } else {
      console.error("El formulario recibido no es un FormGroup o el array de beneficiarios no existe.");
    }
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

  getCargosPublicos(representanteIndex: number): FormArray {
    return this.accionista.at(representanteIndex).get('cargosPublicos') as FormArray;
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
      NombreCompleto: [''],
      TipoIdentificacion: ['-1'],
      NumeroIdentificacion: [''],
      Pais: ['-1'],
      PorcentajeParticipacion: [''],
      Docimicilio: [''],

    });

    // config para el nw elemeto
    IdentificacionValidators.setupIdentificacionValidationForFormGroup(
      vinculosmas5Form,
      'TipoIdentificacion',
      'NumeroIdentificacion'
    );

    vinculosmas5.push(vinculosmas5Form);
  }

  getVinculomas5(vinculomas5Index: number): FormArray {
    return this.accionista.at(vinculomas5Index).get('Vinculosmas') as FormArray;
  }


  getInfoFamiliar(indofamiliarIndex: number): FormArray {
    return this.accionista.at(indofamiliarIndex).get('InfoFamiliaPep') as FormArray;
  }

  addInfoFamilia(representanteIndex: number) {
    const InfoFamilia = this.getInfoFamiliar(representanteIndex);
    const InfoFamiliaForm = this.fb.group({
      NombreCompleto: [''],
      TipoIdentificacion: ['-1'],
      NumeroIdentificacion: [''],
      Nacionalidad: ['-1'],
      CargoContacto: [''],
      FechaNombramiento: [''],
      FechaFinalizacion: [''],
      Domicilio: [''],
      CotizaEnBolsa: ['-1'],
      VinculoFamiliar: [''],

    });

    // new eleemnto
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


  // Enviar el formulario completo
  submit() {
    // if (this.Accionistas.valid) {
    const formValue = this.Accionistas.value; // Obtiene el valor del formulario
    //console.log(JSON.stringify(formValue,null,2));
    const esvalido = this.Accionistas.valid;

    console.log('el formulario es valido?:' + esvalido);

    this.marcarFormularioComoTocado();
    if (this.beneficiarioFinalComponents && this.beneficiarioFinalComponents.length > 0) {
      this.beneficiarioFinalComponents.forEach(component => {
        component.marcarFormularioComoTocado();
      });
    }
  }

  createAccionista(accionista: any): FormGroup {

    const PaisesObligacionTributariaArray = typeof accionista.PaisesObligacionTributaria === 'string' && accionista.PaisesObligacionTributaria.trim() !== ''
      ? accionista.PaisesObligacionTributaria.split(',').map((pais: string) => pais.trim())
      : [];


    const PaisesPaisesCuentasExtArray = typeof accionista.PaisesCuentasExt === 'string' && accionista.PaisesCuentasExt.trim() !== ''
      ? accionista.PaisesCuentasExt.split(',').map((pais: string) => pais.trim())
      : [];

    const PaisesPoderCuentaExtranjeraArray = typeof accionista.PaisesPoderCuentaExtranjera === 'string' && accionista.PaisesPoderCuentaExtranjera.trim() !== ''
      ? accionista.PaisesPoderCuentaExtranjera.split(',').map((pais: string) => pais.trim())
      : [];
    const formGroup = this.fb.group({
      NombreCompleto: [accionista.NombreCompleto || '', Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)],
      tipoDocumento: [accionista.tipoDocumento || '', Validators.required],
      NumeroIdentificacion: [accionista.NumeroIdentificacion || ''],
      Nacionalidad: [accionista.Nacionalidad || ''],
      Porcentajeparticipacion: [accionista.Porcentajeparticipacion || 0],
      Domicilio: [accionista.Domicilio || ''],
      vinculadoPep: [accionista.vinculadoPep || ''],
      ManejaRecursos: [accionista.ManejaRecursos || ''],
      CualesRecursos: [accionista.CualesRecursos || ''],
      PoderPolitico: [accionista.PoderPolitico || ''],
      RamaPoderPublico: [accionista.RamaPoderPublico || ''],
      CargoPublico: [accionista.CargoPublico || ''],
      CualCargoPublico: [accionista.CualCargoPublico || ''],
      ObligacionTributaria: [accionista.ObligacionTributaria || ''],
      PaisesObligacionTributaria: [PaisesObligacionTributariaArray],
      CuentasFinancierasExt: [accionista.CuentasFinancierasExt || ''],
      PaisesCuentasExt: [PaisesPaisesCuentasExtArray],
      TienePoderCuentaExtranjera: [accionista.TienePoderCuentaExtranjera || ''],
      PaisesPoderCuentaExtranjera: [PaisesPoderCuentaExtranjeraArray],
      hasidoPep2: [accionista.hasidoPep2 || ''],
      cargosPublicos: this.fb.array(accionista.cargosPublicos ? accionista.cargosPublicos.map((c: any) => this.createCargo(c)) : []),
      Tienevinculosmas5: [accionista.Tienevinculosmas5 || ''],
      Vinculosmas: this.fb.array(accionista.Vinculosmas ? accionista.Vinculosmas.map((v: any) => this.createVinculo(v)) : []),
      InfoFamiliaPep: this.fb.array(accionista.InfoFamiliaPep ? accionista.InfoFamiliaPep.map((f: any) => this.createFamilia(f)) : []),
      BeneficiariosFinales: this.fb.array(accionista.BeneficiariosFinales ? accionista.BeneficiariosFinales.map((b: any) => this.createBeneficiario(b)) : []),
      CotizaEnBolsa: [accionista.CotizaEnBolsa || '-1']
    });

    IdentificacionValidators.setupIdentificacionValidationForFormGroup(
      formGroup,
      'tipoDocumento',
      'NumeroIdentificacion'
    ); IdentificacionValidators.configureMultipleNestedFormArrays(formGroup, [
      { arrayName: 'Vinculosmas', tipoDocField: 'TipoIdentificacion', numeroIdField: 'NumeroIdentificacion' },
      { arrayName: 'InfoFamiliaPep', tipoDocField: 'TipoIdentificacion', numeroIdField: 'NumeroIdentificacion' }
    ]);

    this.setupCotizaEnBolsaValidation(formGroup);

    return formGroup;
  }

  createBeneficiariosFinales(beneficiariosFinales: any[]): FormArray {
    return this.fb.array(
      beneficiariosFinales ? beneficiariosFinales.map((b: any) => this.createBeneficiarioGroup(b.Beneficiario)) : []
    );
  }

  createBeneficiarioGroup(beneficiarioFinal: any): FormGroup {
    return this.fb.group({
      Beneficiario: this.fb.array(beneficiarioFinal.Beneficiario ? beneficiarioFinal.Beneficiario.map((b: any) => this.createBeneficiario(b)) : [])
    });
  }


  createBeneficiarioFinal(beneficiarioFinal: any): FormGroup {
    return this.fb.group({
      Beneficiario: this.fb.array(beneficiarioFinal.Beneficiario ? beneficiarioFinal.Beneficiario.map((b: any) => this.createBeneficiario(b)) : [])
    });
  }



  createBeneficiario(beneficiario: any): FormGroup {
    return this.fb.group({
      NombreCompleto: [beneficiario.NombreCompleto || '', [Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]],
      tipoDocumento: [beneficiario.tipoDocumento || '-1', [noSeleccionadoValidator()]],
      NumeroIdentificacion: [beneficiario.NumeroIdentificacion || '',],
      Nacionalidad: [beneficiario.Nacionalidad || '-1', [noSeleccionadoValidator()]],
      Porcentajeparticipacion: [beneficiario.Porcentajeparticipacion || ''],
      CotizaEnBolsa: [beneficiario.CotizaEnBolsa || '-1'],
      vinculadoPep: [beneficiario.vinculadoPep || '-1', [noSeleccionadoValidator()]],
      ManejaRecursos: [beneficiario.ManejaRecursos || '-1', [noSeleccionadoValidator()]],
      CualesRecursos: [beneficiario.CualesRecursos || '',],
      PoderPolitico: [beneficiario.PoderPolitico || '-1', [noSeleccionadoValidator()]],
      RamaPoderPublico: [beneficiario.RamaPoderPublico || ''],
      CargoPublico: [beneficiario.CargoPublico || '-1', [noSeleccionadoValidator()]],
      CualCargoPublico: [beneficiario.CualCargoPublico || ''],
      ObligacionTributaria: [beneficiario.ObligacionTributaria || '-1', [noSeleccionadoValidator()]],
      PaisesObligacionTributaria: [beneficiario.PaisesObligacionTributaria || []],
      CuentasFinancierasExt: [beneficiario.CuentasFinancierasExt || '-1', [noSeleccionadoValidator()]],
      PaisesCuentasExt: [beneficiario.PaisesCuentasExt || []],
      TienePoderCuentaExtranjera: [beneficiario.TienePoderCuentaExtranjera || '-1', [noSeleccionadoValidator()]],
      PaisesPoderCuentaExtranjera: [beneficiario.PaisesPoderCuentaExtranjera || []],
      hasidoPep2: [beneficiario.hasidoPep2 || '-1', [, noSeleccionadoValidator()]],
      cargosPublicos: this.fb.array(beneficiario.cargosPublicos ? beneficiario.cargosPublicos.map((c: any) => this.createCargo(c)) : []),
      Tienevinculosmas5: [beneficiario.Tienevinculosmas5 || '-1', [, noSeleccionadoValidator()]],
      Vinculosmas: this.fb.array(beneficiario.Vinculosmas ? beneficiario.Vinculosmas.map((v: any) => this.createVinculo(v)) : []),
      InfoFamiliaPep: this.fb.array(beneficiario.InfoFamiliaPep ? beneficiario.InfoFamiliaPep.map((f: any) => this.createFamilia(f)) : [],)
    });
  }


  createCargo(cargo: any): FormGroup {
    return this.fb.group({
      NombreEntidad: [cargo.NombreEntidad],
      FechaIngreso: [cargo.FechaIngreso],
      FechaDesvinculacion: [cargo.FechaDesvinculacion]
    });
  }

  createVinculo(vinculo: any): FormGroup {
    return this.fb.group({
      NombreCompleto: [vinculo.NombreCompleto],
      TipoIdentificacion: [vinculo.TipoIdentificacion],
      NumeroIdentificacion: [vinculo.NumeroIdentificacion],
      Pais: [vinculo.Pais],
      PorcentajeParticipacion: [vinculo.PorcentajeParticipacion],
      Domiclio: [vinculo.Domiclio]
    });
  }

  createFamilia(familia: any): FormGroup {
    return this.fb.group({
      NombreCompleto: [familia.NombreCompleto],
      TipoIdentificacion: [familia.TipoIdentificacion],
      NumeroIdentificacion: [familia.NumeroIdentificacion],
      Nacionalidad: [familia.Nacionalidad],
      FechaNombramiento: [familia.FechaNombramiento],
      FechaFinalizacion: [familia.FechaFinalizacion],
      Domicilio: [familia.Domicilio],
      CotizaEnBolsa: [familia.CotizaEnBolsa],
      CargoContacto: [familia.CargoContacto],
      VinculoFamiliar: [familia.VinculoFamiliar]
    });
  }

  // En tu componente AccionistasComponent
  percentageValidator(control: AbstractControl): ValidationErrors | null {
    const formArray = control.parent?.parent as FormArray;
    if (!formArray) return null;

    const currentValue = control.value !== null && control.value !== '' ? Number(control.value) : 0;
    let sumOthers = 0;

    formArray.controls.forEach((group: AbstractControl) => {
      const groupForm = group as FormGroup;
      if (groupForm === control.parent) return;
      const percControl = groupForm.get('Porcentajeparticipacion');
      const percValue = percControl && percControl.value !== null && percControl.value !== ''
        ? Number(percControl.value)
        : 0;
      sumOthers += percValue;
    });

    const maxAllowed = 100 - sumOthers;
    return currentValue > maxAllowed ? { exceedsMax: { maxAllowed } } : null;
  }
  loadAccionistas(data: any): void {
    const accionistasArray = this.accionistaArray;

    this.Accionistas.patchValue({
      TieneFigura: data.TieneFigura.toString()
    });

    data.Accionista.forEach((accionista: any) => {
      accionistasArray.push(this.createAccionista(accionista));
    });

    // Forzar actualización de vista
    this.cdr.detectChanges();
  }


  removeValidators(): void {
    if (!this.Accionistas) {
      console.warn('Formulario no definido en RepresentanteLegalComponent');
      return;
    }
    Object.keys(this.Accionistas.controls).forEach(key => {
      const control = this.Accionistas.get(key);
      if (control) {
        control.clearValidators();
        control.clearAsyncValidators();
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  restoreValidators(): void {
    Object.keys(this.Accionistas.controls).forEach(key => {
      const control = this.Accionistas.get(key);
      if (control) {
        control.setValidators(this.originalValidators[key]);
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }



  obtenerDatosFormulario(isValid: boolean): any {
    if (isValid) {
      this.Accionistas.markAllAsTouched();
    }

    const formularioValores = this.Accionistas.value;
    formularioValores.Accionista.forEach((representante: any) => {
      if (Array.isArray(representante.PaisesObligacionTributaria)) {
        representante.PaisesObligacionTributaria = representante.PaisesObligacionTributaria.join(', ');
      }
      if (Array.isArray(representante.PaisesCuentasExt)) {
        representante.PaisesCuentasExt = representante.PaisesCuentasExt.join(', ');
      }
      if (Array.isArray(representante.PaisesPoderCuentaExtranjera)) {
        representante.PaisesPoderCuentaExtranjera = representante.PaisesPoderCuentaExtranjera.join(', ');
      }
      if (representante.BeneficiariosFinales && representante.BeneficiariosFinales.length > 0) {
        representante.BeneficiariosFinales.forEach((beneficiario: any) => {
          if (Array.isArray(beneficiario.PaisesObligacionTributaria)) {
            beneficiario.PaisesObligacionTributaria = beneficiario.PaisesObligacionTributaria.join(', ');
          }
          if (Array.isArray(beneficiario.PaisesCuentasExt)) {
            beneficiario.PaisesCuentasExt = beneficiario.PaisesCuentasExt.join(', ');
          }
          if (Array.isArray(beneficiario.PaisesPoderCuentaExtranjera)) {
            beneficiario.PaisesPoderCuentaExtranjera = beneficiario.PaisesPoderCuentaExtranjera.join(', ');
          }
        });
      }
    });
    return formularioValores;
  }


  ObtenerDivFormulario() {
    const DATA: any = document.getElementById('AccionistasDiv');

    return DATA;
  }

  obtenerCamposInvalidos(): any[] {
    const invalidFields: any[] = [];

    // Recorre el FormArray de representantes
    (this.accionista.controls as FormGroup[]).forEach((representanteGroup, representanteIndex) => {
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

  marcarFormularioComoTocado() {
    Object.values(this.accionista.controls).forEach(control => {
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

  esFormularioValido() {

    const basicFormValid = this.Accionistas.get('TieneFigura')?.valid;

    if (!basicFormValid) {
      return false;
    }

    if (this.getTieneFiguraValue() === '0') {
      return true;
    }

    const accionistas = this.accionista;
    for (let i = 0; i < accionistas.length; i++) {
      const accionistaForm = accionistas.at(i) as FormGroup;


      const fieldsToCheck = Object.keys(accionistaForm.controls).filter(key => key !== 'BeneficiariosFinales');

      for (const fieldName of fieldsToCheck) {
        const control = accionistaForm.get(fieldName);
        if (control && control.invalid) {
          return false;
        }
      }
    }


    if (this.beneficiarioFinalComponents && this.beneficiarioFinalComponents.length > 0) {
      const componentsArray = this.beneficiarioFinalComponents.toArray();
      for (let i = 0; i < componentsArray.length; i++) {
        const component = componentsArray[i];
        if (component && !component.esFormularioValido()) {
          return false;
        }
      }
    }

    return true;
  }

  getTieneFiguraValue(): string {
    return this.Accionistas.get('TieneFigura')?.value;
  }


  onPaisesObligacionTributariaChange(index: number, selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.accionista.at(index).get('PaisesObligacionTributaria')?.setValue(paises);
  }

  onPaisesCuentasExtChange(index: number, selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.accionista.at(index).get('PaisesCuentasExt')?.setValue(paises);
  }

  onPaisesPoderCuentaExtranjeraChange(index: number, selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.accionista.at(index).get('PaisesPoderCuentaExtranjera')?.setValue(paises);
  }

  /**
   * Metodo para validar entrada de numeros
   */
  allowOnlyNumbers(event: KeyboardEvent, accionistaIndex: number): void {
    const accionistaForm = this.accionista.at(accionistaIndex) as FormGroup;
    const tipoId = accionistaForm.get('tipoDocumento')?.value;
    IdentificacionValidators.allowOnlyNumbers(event, tipoId);
  }

  validateNumeroIdentificacionInput(event: any, accionistaIndex: number): void {
    const accionistaForm = this.accionista.at(accionistaIndex) as FormGroup;
    const tipoId = accionistaForm.get('tipoDocumento')?.value;
    const control = accionistaForm.get('NumeroIdentificacion');
    IdentificacionValidators.validateNumeroIdentificacionInput(event, tipoId, control);
  }

  // method para los formarrays
  allowOnlyNumbersVinculo(event: KeyboardEvent, accionistaIndex: number, vinculoIndex: number): void {
    const accionistaForm = this.accionista.at(accionistaIndex) as FormGroup;
    IdentificacionValidators.allowOnlyNumbersNested(event, accionistaForm, 'Vinculosmas', vinculoIndex);
  }

  validateNumeroIdentificacionInputVinculo(event: any, accionistaIndex: number, vinculoIndex: number): void {
    const accionistaForm = this.accionista.at(accionistaIndex) as FormGroup;
    IdentificacionValidators.validateNumeroIdentificacionInputNested(event, accionistaForm, 'Vinculosmas', vinculoIndex);
  }

  allowOnlyNumbersInfoFamilia(event: KeyboardEvent, accionistaIndex: number, familiaIndex: number): void {
    const accionistaForm = this.accionista.at(accionistaIndex) as FormGroup;
    IdentificacionValidators.allowOnlyNumbersNested(event, accionistaForm, 'InfoFamiliaPep', familiaIndex);
  }

  validateNumeroIdentificacionInputInfoFamilia(event: any, accionistaIndex: number, familiaIndex: number): void {
    const accionistaForm = this.accionista.at(accionistaIndex) as FormGroup;
    IdentificacionValidators.validateNumeroIdentificacionInputNested(event, accionistaForm, 'InfoFamiliaPep', familiaIndex);
  }

  private setupCotizaEnBolsaValidation(accionistaForm: FormGroup): void {
    const tipoDocumentoControl = accionistaForm.get('tipoDocumento');
    const cotizaEnBolsaControl = accionistaForm.get('CotizaEnBolsa');

    if (tipoDocumentoControl && cotizaEnBolsaControl) {

      this.updateCotizaEnBolsaValidation(cotizaEnBolsaControl, tipoDocumentoControl.value);

      tipoDocumentoControl.valueChanges.subscribe(tipoDocumento => {
        this.updateCotizaEnBolsaValidation(cotizaEnBolsaControl, tipoDocumento);
      });
    }
  }

  private updateCotizaEnBolsaValidation(cotizaControl: AbstractControl, tipoDocumento: any): void {
    if (tipoDocumento === '3' || tipoDocumento === 3) {

      cotizaControl.setValidators([Validators.required, noSeleccionadoValidator()]);
    } else {
      cotizaControl.clearValidators();
      cotizaControl.setValue('-1');
    }
    cotizaControl.updateValueAndValidity();
  }
}


