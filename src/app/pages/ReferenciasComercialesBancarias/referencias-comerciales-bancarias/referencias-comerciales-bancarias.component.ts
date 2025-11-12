import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ServicioPrincipalService } from '../../Services/main.services';
import { TranslateService } from '@ngx-translate/core';
import { IdentificacionValidators } from '../../utils/identificacion-validators';

@Component({
  selector: 'app-referencias-comerciales-bancarias',
  templateUrl: './referencias-comerciales-bancarias.component.html',
  styleUrl: './referencias-comerciales-bancarias.component.scss'
})
export class ReferenciasComercialesBancariasComponent  implements OnInit {
  Lang:string='es';
  @Input() IdEstadoFormulario: number;
  @Input() IdFormulario: number;
  @Input() editable:boolean;

  @Input() ListaTipoReferencia: any[] ;
  ReferenciasFinancieras: FormGroup;

  private originalValidators: { [key: string]: any } = {};

  constructor(
    private fb: FormBuilder,
    private serviciocliente: ServicioPrincipalService,
    private translate: TranslateService,private cdr: ChangeDetectorRef
  ) {
    this.translate.setDefaultLang('es');
    this.Lang = localStorage.getItem('language') || 'es';
    this.translate.use(this.Lang);
    this.ReferenciasFinancieras = this.fb.group({
      ReferenciaFinanciera: this.fb.array([])
    });
  }

  ngOnInit(): void {

    Object.keys(this.ReferenciasFinancieras.controls).forEach(key => {
      const control = this.ReferenciasFinancieras.get(key);
      this.originalValidators[key] = control?.validator;
    });
    if(this.IdFormulario !== 0 && this.IdFormulario !== undefined)
      {
    this.serviciocliente.ConsultaReferenciasFinancieras(this.IdFormulario).subscribe((contactos: any[]) => {
      this.cargarRefencias(contactos);
      if (this.IdEstadoFormulario===3) {
        this.ReferenciasFinancieras.disable();
      }
    });
  }
  }

  cargarRefencias(referencia: any[]) {
    this.Referencia.clear();
    if (referencia)
      {// Limpia el FormArray antes de cargar los datos
    referencia.forEach(contactoData => {
      this.Referencia.push(this.crearRefercia(contactoData));
    });
  }
  }

  // Obtener el FormArray de Representantes
  get Referencia() {
    return this.ReferenciasFinancieras.get('ReferenciaFinanciera') as FormArray;
  }

  // Agregar un nuevo representante
  addReferencia() {
    this.Referencia.push(this.crearRefercia());
  }

  // Quitar representante
  removeReferencia(index: number,datos:any) {
    this.Referencia.removeAt(index);

    console.log(datos.controls.Id.value);
  }
    // Crear el grupo de un representante, incluyendo el array de cargos públicos
  crearRefercia(data?: any): FormGroup {
    return this.fb.group({
      Id:[data?.id || 0, Validators.required],
      TipoReferencia:[data?.tipoReferencia || ''],
      NombreCompleto: [data?.nombreCompleto || ''],
      Ciudad: [data?.ciudad || '',[Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]],
      Telefono:[data?.telefono || '', [Validators.pattern(/^[0-9]+$/)]],
      IdFormulario: [this.IdFormulario],
      ValorAnualCompras: [ data?.valorAnualCompras || ''],
      Cupo: [ data?.cupo || ''],
      Plazo: [ data?.plazo || '']

    });
  }

  /*crearRefercia(): FormGroup {
    return this.fb.group({
      TipoReferencia: [''],
      NombreCompleto: [''],
      Ciudad: [''],
      Telefono:[''],


    });
  }*/

    esFormularioValido()
{
  return this.ReferenciasFinancieras.valid;
}

  removeValidators(): void {
    if (!this.ReferenciasFinancieras) {
      console.warn('Formulario no definido en RepresentanteLegalComponent');
      return;
    }
    Object.keys(this.ReferenciasFinancieras.controls).forEach(key => {
      const control = this.ReferenciasFinancieras.get(key);
      if (control) {
        control.clearValidators();
        control.clearAsyncValidators();
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  restoreValidators(): void {
    Object.keys(this.ReferenciasFinancieras.controls).forEach(key => {
      const control = this.ReferenciasFinancieras.get(key);
      if (control) {
        control.setValidators(this.originalValidators[key]);
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }


  obtenerDatosFormulario(isValid: boolean) {
    if (isValid) {
      this.ReferenciasFinancieras.markAllAsTouched();
      return this.ReferenciasFinancieras.value;
    } else {
      return this.ReferenciasFinancieras.value;
    }
  }

  submit() {

  }

  obtenerCamposInvalidos() {
    const camposInvalidos: { index: number; campo: string; errores: any }[] = [];

    this.Referencia.controls.forEach((grupo, index) => {
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


  Desabilitacamposdespuesdeenvio()
{
  this.editable=false;

  this.ReferenciasFinancieras.disable()
  this.cdr.detectChanges();
}

ObtenerDivFormulario()
{
  const DATA: any = document.getElementById('ReferenciasBanComDiv');

  return DATA;
}

// Métodos de validación de teléfono
allowOnlyNumbersForPhone(event: KeyboardEvent): void {
  IdentificacionValidators.allowOnlyNumbersForPhone(event);
}

validatePhoneInput(event: any, control?: AbstractControl | null): void {
  IdentificacionValidators.validatePhoneInput(event, control);
}

// Método helper para obtener el control de teléfono en el template
getReferenciaTelefono(index: number): AbstractControl | null {
  return this.Referencia.at(index).get('Telefono');
}

}