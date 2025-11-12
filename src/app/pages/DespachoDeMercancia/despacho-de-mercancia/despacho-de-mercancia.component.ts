import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../Services/main.services';
import { noSeleccionadoValidator } from '../../utils/validcliente/validacionOpcionales';
import { IdentificacionValidators } from '../../utils/identificacion-validators';

@Component({
  selector: 'app-despacho-de-mercancia',
  templateUrl: './despacho-de-mercancia.component.html',
  styleUrl: './despacho-de-mercancia.component.scss'
})
export class DespachoDeMercanciaComponent {
  formulario: FormGroup;
  @Input() IdEstadoFormulario: number;
  @Input() IdFormulario: number;
  @Input() ListaPaises: any[];
  @Input() editable: boolean;

  private originalValidators: { [key: string]: any } = {};

  constructor(private fb: FormBuilder, private translate: TranslateService, private serviciocliente: ServicioPrincipalService) { }



  ngOnInit(): void {

    this.initializeForm();

    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      this.originalValidators[key] = control?.validator;
    });

    if (this.IdFormulario !== 0 && this.IdFormulario !== undefined) {
      this.ConsultaDespacho();
    }
  }


  ConsultaDespacho() {
    this.serviciocliente.ConsultaDespachoMercancia(this.IdFormulario).subscribe(data => {

      if (data) {
        this.inicilizarinfogurdada(data)
      }

      if (!this.editable) {

        this.formulario.disable();

        //this.deshabilitarFormulario(this.DatosContactos);
      }

    });
  }

  inicilizarinfogurdada(obj: any) {
    this.formulario.patchValue({
      Id: obj.id,
      IdFormulario: obj.idFormulario,
      DireccionDespacho: obj.direccionDespacho,
      Pais: obj.pais,
      Cuidad: obj.cuidad, 
      CodigoPostalEnvio: obj.codigoPostalEnvio,
      Telefono: obj.telefono,
      EmailCorporativo: obj.emailCorporativo
    });
  }





  private initializeForm(): void {
    this.formulario = this.fb.group({
      Id: [0],
      IdFormulario: [this.IdFormulario],
      DireccionDespacho: [''],
      Pais: ['-1'],
      Cuidad: [''],
      CodigoPostalEnvio: [''],
      Telefono: [''],
      EmailCorporativo: ['']
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

  obtenerDatosFormulario(isValid: boolean): any {
    if (isValid) {
      return this.formulario.getRawValue();
    } else {
      return this.formulario.value;
    }
  }

  esFormularioValido() {
    return this.formulario.valid;
  }

  marcarFormularioComoTocado() {
    Object.values(this.formulario.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  ObtenerDivFormulario() {
    const DATA: any = document.getElementById('DespachoMercanciaDiv');

    return DATA;
  }

  Desabilitacamposdespuesdeenvio() {
    this.editable = false;
    this.formulario.disable()
  }

  private logInvalidControlsRecursive(
    form: FormGroup | FormArray,
    parentName: string = ''
  ) {
    Object.keys(form.controls).forEach(controlName => {
      const control = form.get(controlName);
      const fullPath = parentName ? `${parentName}.${controlName}` : controlName;

      if (control instanceof FormGroup || control instanceof FormArray) {
        if (control.invalid) {
          console.warn('Grupo/Array inválido:', fullPath, 'errors:', control.errors);
        }
        this.logInvalidControlsRecursive(control, fullPath);
      } else if (control && control.invalid) {
        console.error('Control inválido:', fullPath, 'errors:', control.errors);
      }
    });
  }
  obtenerCamposInvalidos() {
    this.logInvalidControlsRecursive(this.formulario, 'DespachoMercancia');
    const camposInvalidos = [];
    const controles = this.formulario.controls;
    for (const nombreControl in controles) {
      if (controles[nombreControl].invalid) {
        camposInvalidos.push({
          campo: nombreControl,
          errores: controles[nombreControl].errors
        });
      }
    } return camposInvalidos;
  }

  // Métodos de validación de teléfono
  allowOnlyNumbersForPhone(event: KeyboardEvent): void {
    IdentificacionValidators.allowOnlyNumbersForPhone(event);
  }

  validatePhoneInput(event: any, control?: AbstractControl | null): void {
    IdentificacionValidators.validatePhoneInput(event, control);
  }

}
