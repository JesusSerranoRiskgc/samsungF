import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../Services/main.services';
import { IdentificacionValidators } from '../../utils/identificacion-validators';

@Component({
  selector: 'app-datos-contacto',
  templateUrl: './datos-contacto.component.html',
  styleUrl: './datos-contacto.component.scss'
})
export class DatosContactoComponent implements OnInit {
  Lang: string = 'es';
  @Input() IdEstadoFormulario: number;
  @Input() IdFormulario: number;
  @Input() editable: boolean;

  DatosContactos: FormGroup;
  private originalValidators: { [key: string]: any } = {};

  private emailFields: string[] = [
    'CorreoElectronico'
  ];

  constructor(
    private fb: FormBuilder,
    private serviciocliente: ServicioPrincipalService,
    private translate: TranslateService, private cdr: ChangeDetectorRef
  ) {
    this.translate.setDefaultLang('es');
    this.Lang = localStorage.getItem('language') || 'es';
    this.translate.use(this.Lang);
    this.DatosContactos = this.fb.group({
      contactos: this.fb.array([], Validators.required)
    });
  }

  private requireAtSymbolValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value || typeof value !== 'string') {
        return { missingAtSymbol: true };
    }
    return value.includes('@') ? null : { missingAtSymbol: true };
    }
  }

  private applyEmailValidators(): void {
    this.emailFields.forEach(fieldName => {
        const control = this.DatosContactos.get(fieldName);
        if (control) {
            const existingValidators = control.validator ? [control.validator] : [];
            control.setValidators([
                ...existingValidators,
                this.requireAtSymbolValidator()
            ]);
            control.updateValueAndValidity();
        } else {
            console.warn(`Email field ${fieldName} not found in form`);
        }
    });
}

  ngOnInit(): void {


    Object.keys(this.DatosContactos.controls).forEach(key => {
      const control = this.DatosContactos.get(key);
      this.originalValidators[key] = control?.validator;
    });

    if (this.IdFormulario !== 0 && this.IdFormulario !== undefined) {

      this.serviciocliente.ConsultaDatosContactos(this.IdFormulario).subscribe({
        next: (contactos: any[]) => {
          this.cargarContactos(contactos);
          this.applyEmailValidators();
        },
        error: (error) => {
          console.error('[DatosContacto] Error al consultar datos:', error);
        }
      });
    } else {

    }
  }

  // Obtener el FormArray de Representantes
  get contacto() {
    return this.DatosContactos.get('contactos') as FormArray;
  }

  // Agregar un nuevo representante
  addcontacto() {
    const newContacto = this.crearContacto();
    this.contacto.push(newContacto);
    this.applyEmailValidators();
  }

  // Quitar representante
  removeDirectivo(index: number) {
    this.contacto.removeAt(index);
  }

  // Crear el grupo de un representante, incluyendo el array de cargos públicos
  /*crearContacto(): FormGroup {
    return this.fb.group({
      NombreContacto: ['', Validators.required],
      CargoContacto: ['', Validators.required],
      AreaContacto: ['', Validators.required],
      TelefonoContacto:['', Validators.required],
      CorreoElectronico: ['', Validators.required]

    });
  }*/


   crearContacto(data?: any): FormGroup {
  return this.fb.group({
    Id: [data?.id || 0, [Validators.required]],
    NombreContacto: [
      data?.nombreContacto || '',
      [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]
    ],
    CargoContacto: [data?.cargoContacto || '', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]],
    AreaContacto: [
      data?.areaContacto || '',
      [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]
    ],
    TelefonoContacto: [
      data?.telefonoContacto || '',
      [Validators.required, Validators.pattern(/^[0-9]+$/)]
    ],
    CorreoElectronico: [
      data?.correoElectronico || '',
      [Validators.required, IdentificacionValidators.emailWithComValidator()]
    ],
    Ciudad: [
      data?.ciudad || '',
      [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]
    ],
    Direccion: [data?.direccion || '', [Validators.required]],
    IdFormulario: [this.IdFormulario]
  });
}

  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const charCode = event.key.charCodeAt(0);
    if (!allowedKeys.includes(event.key) && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }
  /*marcarFormularioComoTocado()
  {
    Object.values(this.DatosContactos.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  */
  marcarFormularioComoTocado() {
    Object.values(this.DatosContactos.controls).forEach(control => {
      if (control instanceof FormArray) {
        control.controls.forEach((grupo) => {
          const formGroup = grupo as FormGroup; // Conversión explícita a FormGroup
          Object.values(formGroup.controls).forEach(campo => {
            campo.markAsTouched();
          });
        });
      } else {
        control.markAsTouched();
      }
    });
  }


  removeValidators(): void {
    if (!this.DatosContactos) {
      console.warn('Formulario no definido en RepresentanteLegalComponent');
      return;
    }
    Object.keys(this.DatosContactos.controls).forEach(key => {
      const control = this.DatosContactos.get(key);
      if (control) {
        control.clearValidators();
        control.clearAsyncValidators();
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  restoreValidators(): void {
    Object.keys(this.DatosContactos.controls).forEach(key => {
      const control = this.DatosContactos.get(key);
      if (control) {
        control.setValidators(this.originalValidators[key]);
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  obtenerDatosFormulario(isValid: boolean) {
    if (isValid) {
      this.DatosContactos.markAllAsTouched();
      const datos = this.DatosContactos.value;

      return datos;
    } else {
      const datos = this.DatosContactos.value;

      return datos;
    }
  }

  esFormularioValido() {
    return this.DatosContactos.valid;
  }

  /*obtenerCamposInvalidos() {
    const camposInvalidos = [];
    const controles = this.DatosContactos.controls;
    for (const nombreControl in controles) {
      if (controles[nombreControl].invalid) {
        camposInvalidos.push({
          campo: nombreControl,
          errores: controles[nombreControl].errors
        });
      }
    }
    return camposInvalidos;
  }
  */
  obtenerCamposInvalidos() {
    const camposInvalidos: { index: number; campo: string; errores: any }[] = [];

    this.contacto.controls.forEach((grupo, index) => {
      const formGroup = grupo as FormGroup; // Conversión explícita a FormGroup

      Object.keys(formGroup.controls).forEach(campo => {
        const control = formGroup.get(campo);
        if (control && control.invalid) {
          camposInvalidos.push({
            index,
            campo,
            errores: control.errors
          });
        }
      });
    });

    return camposInvalidos;
  }

  cargarContactos(contactos: any[]) {


    this.contacto.clear();
    if (contactos) {// Limpia el FormArray antes de cargar los datos
      contactos.forEach(contactoData => {
        this.contacto.push(this.crearContacto(contactoData));
      });



      if (!this.editable) {
        this.DatosContactos.disable();
      }
    } else {

    }
  }

  submit() {

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

  ObtenerDivFormulario() {
    const DATA: any = document.getElementById('DatosContactoDiv');

    return DATA;
  }
  Desabilitacamposdespuesdeenvio() {
    this.editable = false;
    this.DatosContactos.disable()
    this.IdEstadoFormulario = 3;
    this.cdr.detectChanges(); //
  }

  // Métodos de validación de teléfono
  allowOnlyNumbersForPhone(event: KeyboardEvent): void {
    IdentificacionValidators.allowOnlyNumbersForPhone(event);
  }

  validatePhoneInput(event: any, control?: AbstractControl | null): void {
    IdentificacionValidators.validatePhoneInput(event, control);
  }

}
