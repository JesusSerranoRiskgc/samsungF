import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../Services/main.services';
import { DatosRevisorFiscalDto } from '../../Models/DatosRevisorFiscalDto';
import { IdentificacionValidators } from '../../utils/identificacion-validators';

@Component({
  selector: 'app-datos-revisorfiscal',
  templateUrl: './datos-revisorfiscal.component.html'
})
export class DatosRevisorFiscalComponent implements OnInit, OnChanges {
  @Input() IdEstadoFormulario: number;
  @Input() IdFormulario: number;
  @Input() ListaSino: any[];
  @Input() editable: boolean;
  @Input() tipoTercero: number;
  @Input() ListaTipoDocumentos: any[];
  formulario: FormGroup;
  private originalValidators: { [key: string]: any } = {};
  documentosFiltrados: any[];

  constructor(
    private fb: FormBuilder,
    private revisorFiscalService: ServicioPrincipalService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('es');
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['IdEstadoFormulario']) {
      // Aquí puedes manejar el cambio según sea necesario
    }
    this.documentosFiltrados = this.ListaTipoDocumentos.filter(tipo => tipo.id !== '3');
  }

  // validator @
  private requireAtSymbolValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value || typeof value !== 'string') {
        return { missingAtSymbol: true };
      }
      return value.includes('@') ? null : { missingAtSymbol: true };
    };
  }

  ngOnInit(): void {
    this.crearFormulario();


   IdentificacionValidators.setupIdentificacionValidationForFormGroup(
      this.formulario,
      'tipoID',
      'numeroID'
    );
 
    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      this.originalValidators[key] = control?.validator;
    });
    if (this.IdFormulario) {
      this.cargarDatosRevisorFiscal(this.IdFormulario);
    }

    if (!this.editable) {
      this.formulario.disable();
    }

 this.formulario.patchValue({ tieneRevisorFiscal: true });
  /* this.aplicarValidadoresRevisorFiscal(true); */
    this.formulario.get('revisorFiscalAdscritoFirma')?.valueChanges.subscribe((valor: boolean) => {
      const nombreFirmaControl = this.formulario.get('nombreFirma');
      if (valor) {
        nombreFirmaControl?.setValidators([Validators.required]);
      } else {
        nombreFirmaControl?.clearValidators();
        this.formulario.patchValue({ nombreFirma: '' });
      }
      nombreFirmaControl?.updateValueAndValidity();
    });


this.formulario.get('tieneRevisorFiscal')?.valueChanges.subscribe((valor: boolean) => {
  const fields = [
    'nombreCompletoApellidos',
    'tipoID',
    'numeroID',
    'telefono',
    'ciudad',
    'direccion',
    'email'
  ];

  const justificarControl = this.formulario.get('justificarRespuesta');

  if (!valor) {
    // Si no tiene revisor fiscal, justificar es requerido
    justificarControl?.setValidators([Validators.required]);
  } else {
    // Si tiene revisor fiscal, justificar no es requerido
    justificarControl?.clearValidators();
  }
  justificarControl?.updateValueAndValidity();

  fields.forEach(field => {
    const control = this.formulario.get(field);
    if (!control) return;

    if (valor) {
      // Aplicar validadores solo si tieneRevisorFiscal = true
      switch (field) {
        case 'email':
          control.setValidators([
            Validators.required,
            Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
            this.requireAtSymbolValidator()
          ]);
          break;
        case 'telefono':
          control.setValidators([
            Validators.required,
            Validators.pattern(/^[0-9]+$/)
          ]);
          break;
        case 'ciudad':
        case 'nombreCompletoApellidos':
          control.setValidators([
            Validators.required,
            Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
          ]);
          break;
        default:
          control.setValidators([Validators.required]);
      }
    } else {
      // Limpiar validadores si tieneRevisorFiscal = false
      control.clearValidators();
      control.setValue(''); // opcional: limpiar el valor del campo
    }

    control.updateValueAndValidity();
  });
});

    this.documentosFiltrados = this.ListaTipoDocumentos.filter(tipo => tipo.id !== '3');
  }


  Desabilitacamposdespuesdeenvio() {
    this.editable = false;
    this.formulario.disable();
    // this.deshabilitarFormulario(this.formulario);

    this.cdr.detectChanges();
  }

  crearFormulario(): void {
    this.formulario = this.fb.group({
      id: [0],
      idFormulario: [this.IdFormulario],
      tieneRevisorFiscal: [true],
      justificarRespuesta: [''],
      revisorFiscalAdscritoFirma: [false],
      nombreFirma: [''],
      nombreCompletoApellidos: ['',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        ]],
      tipoID: [''],
      numeroID: ['',[
            Validators.pattern(/^[0-9]+$/)
          ]],
      telefono: [''],
      ciudad: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        ]
      ],
      direccion: [''],
      email: ['']
    });
  }

  cargarDatosRevisorFiscal(idFormulario: number): void {
    this.revisorFiscalService.ConsultaDatosRevisorFiscal(idFormulario).subscribe({
      next: (data) => {
        if (data) {
          this.formulario.patchValue(data);
        }
      },
      error: (err) => console.error('Error al cargar DatosRevisorFiscal', err)
    });
  }

  guardarDatosRevisorFiscal(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const dto: DatosRevisorFiscalDto = this.formulario.value;
    this.revisorFiscalService.GuardaDatosRevisorFiscal(dto).subscribe({
      next: (res) => {
        console.log('Guardado con éxito', res);
      },
      error: (err) => {
        console.error('Error al guardar DatosRevisorFiscal', err);
      }
    });
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const tipoId = this.formulario.get('tipoID')?.value;
    IdentificacionValidators.allowOnlyNumbers(event, tipoId);
  }

  validateNumeroIdentificacionInput(event: any): void {
    const tipoId = this.formulario.get('tipoID')?.value;
    const control = this.formulario.get('numeroID');
    IdentificacionValidators.validateNumeroIdentificacionInput(event, tipoId, control);
  }

  removeValidators(): void {
    if (!this.formulario) {
      console.warn('Formulario no definido en DatosRevisorFiscalComponent');
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
      this.formulario.markAllAsTouched();
      return this.formulario.getRawValue();
    } else {
      return this.formulario.getRawValue();
    }
  }

  esFormularioValido(): boolean {
    return this.formulario.valid;
  }

  marcarFormularioComoTocado(): void {
    Object.values(this.formulario.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  /**
   * Solo números en campos de teléfono
   */
  allowOnlyNumbersForPhone(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;

    if ([8, 9, 27, 13, 46].indexOf(charCode) !== -1 ||
      (charCode === 65 && event.ctrlKey === true) ||
      (charCode === 67 && event.ctrlKey === true) ||
      (charCode === 86 && event.ctrlKey === true) ||
      (charCode === 88 && event.ctrlKey === true)) {
      return;
    }

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  obtenerCamposInvalidos(): string[] {
    const invalidFields: string[] = [];

    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      if (control && control.invalid) {
        invalidFields.push(key);
      }
    });

    return invalidFields;
  }
  

  validatePhoneInput(event: any): void {
    const input = event.target;
    const value = input.value;

    const numericValue = value.replace(/[^0-9]/g, '');

    input.value = numericValue;
    this.formulario.get('telefono')?.setValue(numericValue);
  }
}
