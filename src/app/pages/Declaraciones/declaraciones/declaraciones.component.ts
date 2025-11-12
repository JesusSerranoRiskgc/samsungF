import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../Services/main.services';
import { IdentificacionValidators } from '../../utils/identificacion-validators';

@Component({
  selector: 'app-declaraciones',
  templateUrl: './declaraciones.component.html',
  styleUrls: ['./declaraciones.component.scss']
})
export class DeclaracionesComponent implements OnInit {
  formulario: FormGroup;
  private originalValidators: { [key: string]: any } = {};

  @Input() IdFormulario: number;
  @Input() editable: boolean;
  @Input() IdEstadoFormulario: number;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private serviciocliente: ServicioPrincipalService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeForm();

    // Guardar los validadores originales
    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      this.originalValidators[key] = control?.validator;
    });

    if (this.IdFormulario) {
      this.ConsultaDeclaraciones();
    }
  }

  private initializeForm(): void {
    this.formulario = this.fb.group({
      Id: [0],
      IdFormulario: [this.IdFormulario],
      NombreRepresentanteFirma: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]],
      CorreoRepresentante: ['', [Validators.required, IdentificacionValidators.emailWithComValidator()]]
    });
  }

  // Validar si el formulario es válido (marca todo como tocado primero)
  esFormularioValido(): boolean {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity({ emitEvent: false });
    return this.formulario.valid;
  }

  // Marcar todos los campos como tocados
  marcarFormularioComoTocado(): void {
    Object.values(this.formulario.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.marcarRecursivo(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  private marcarRecursivo(control: FormGroup | FormArray) {
    Object.values(control.controls).forEach(c => {
      if (c instanceof FormGroup || c instanceof FormArray) {
        this.marcarRecursivo(c);
      } else {
        c.markAsTouched();
      }
    });
  }

  // Inicializar datos cargados desde la API
  inicializarInfoGuardada(obj: any) {
    this.formulario.patchValue({
      Id: obj.id,
      IdFormulario: obj.idFormulario,
      NombreRepresentanteFirma: obj.nombreRepresentanteFirma,
      CorreoRepresentante: obj.correoRepresentante
    });
  }

  // Consultar información guardada
  ConsultaDeclaraciones() {
    this.serviciocliente.ConsultaDeclaraciones(this.IdFormulario).subscribe(data => {
      if (data) {
        this.inicializarInfoGuardada(data);
      }

      if (!this.editable) {
        this.formulario.disable();
      }
    });
  }

  // Deshabilitar campos después del envío
  Desabilitacamposdespuesdeenvio() {
    this.editable = false;
    this.formulario.disable();
    this.cdr.detectChanges();
  }

  // Obtener campos inválidos con sus errores
  obtenerCamposInvalidos(): { campo: string; errores: any }[] {
    const camposInvalidos: { campo: string; errores: any }[] = [];

    const revisarControl = (control: AbstractControl, path: string) => {
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(key => {
          revisarControl(control.controls[key], path ? `${path}.${key}` : key);
        });
      } else if (control instanceof FormArray) {
        control.controls.forEach((c, index) => {
          revisarControl(c, path ? `${path}[${index}]` : `[${index}]`);
        });
      } else if (control && control.invalid) {
        camposInvalidos.push({ campo: path, errores: control.errors });
      }
    };

    revisarControl(this.formulario, '');
    return camposInvalidos;
  }

 
ObtenerDivFormulario() {
  const DATA: any = document.getElementById('declaraciones');
  return DATA;
}
  removeValidators(): void {
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
      this.formulario.markAllAsTouched();
    }
    return this.formulario.getRawValue();
  }
}
