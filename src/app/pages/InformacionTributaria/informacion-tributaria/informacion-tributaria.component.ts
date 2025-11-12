import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../Services/main.services';
import { InternalDataService } from '../../Services/InternalDataService';
import { noSeleccionadoValidator } from '../../utils/validcliente/validacionOpcionales';

@Component({
  selector: 'app-informacion-tributaria',
  templateUrl: './informacion-tributaria.component.html',
  styleUrl: './informacion-tributaria.component.scss'
})
export class InformacionTributariaComponent implements OnInit {

  @Input() IdEstadoFormulario: number;
  @Input() IdFormulario: number;
  @Input() FechaFormulario: string;
  @Input() Lang: string;
  @Input() ListaSino: any[];
  @Input() editable: boolean;
  formulario: FormGroup;

  private originalValidators: { [key: string]: any } = {};

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private serviciocliente: ServicioPrincipalService,
    private cdr: ChangeDetectorRef,
    private internalservicet: InternalDataService
  ) { }

  ngOnInit(): void {
    this.initializeForm();

    this.ConsultaInformacionTriburaria();

    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      this.originalValidators[key] = control?.validator;
    });
    this.setupValueChanges();
    const retArr = this.getRetenciones();
    retArr.controls.forEach((group: AbstractControl, index: number) => {
      const concepto = group.get('concepto')?.value;
      const porcentaje = group.get('porcentaje')?.value;

      console.log(`Fila ${index}: concepto=${concepto}, porcentaje=${porcentaje}`);
    });
    if (this.formulario) {
      if (!this.editable) {
        this.formulario.disable();
        this.formulario.get('concepto')?.disable();
      }
    }



  }





  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const charCode = event.key.charCodeAt(0);
    if (!allowedKeys.includes(event.key) && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  allowOnlyLetters(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', ' '];
    if (allowedKeys.includes(event.key)) return;

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  ConsultaInformacionTriburaria() {
    if (this.IdFormulario !== 0) {
      this.serviciocliente.ConsultaInformacionTributaria(this.IdFormulario).subscribe(data => {

        if (data) {
          this.inicilizarinfogurdada(data);
        }
      });
    }


  }

  private formatearFecha(valor: any): string {
    // admite Date o string ISO
    const d = new Date(valor);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0]; // yyyy-MM-dd
  }
  inicilizarinfogurdada(data: any) {
    // --- Preprocesar retenciones ---
    let retencionesArray: any[] = [];
    if (data.retenciones) {
      if (typeof data.retenciones === 'string') {
        try {
          retencionesArray = JSON.parse(data.retenciones);
          if (!Array.isArray(retencionesArray)) retencionesArray = [];
        } catch {
          retencionesArray = [];
        }
      } else if (Array.isArray(data.retenciones)) {
        retencionesArray = data.retenciones;
      }
    }

    // --- Normalizar fechas ---
    const fechaGran = data.fechaResolucionGranContribuyente
      ? this.formatearFecha(data.fechaResolucionGranContribuyente)
      : '';
    const fechaAuto = data.fechaResolucionAutorretenedor
      ? this.formatearFecha(data.fechaResolucionAutorretenedor)
      : '';

    // --- Cargar resto de campos ---
    this.formulario.patchValue({
      Id: data.id ?? 0,
      IdFormulario: this.IdFormulario ?? 0,
      granContribuyente: data.granContribuyente ?? null,
      numResolucionGranContribuyente: data.numResolucionGranContribuyente ?? '',
      fechaResolucionGranContribuyente: fechaGran,
      autorretenedor: data.autorretenedor ?? null,
      numResolucionAutorretenedor: data.numResolucionAutorretenedor ?? '',
      fechaResolucionAutorretenedor: fechaAuto,
      responsableICA: data.responsableICA ?? null,
      municipioRetener: data.municipioRetener ?? '',
      tarifa: data.tarifa ?? '',
      responsableIVA: data.responsableIVA ?? null,
      agenteRetenedorIVA: data.agenteRetenedorIVA ?? null,
      regimenTributario: data.regimenTributario ?? '',
      Sucursal: data.sucursal ?? ''
    }, { emitEvent: false });

    // --- Retenciones ---
    const retArr = this.getRetenciones();
    retArr.clear();

    retencionesArray.forEach((retencion: any) => {
      // Creamos el grupo
      const group = this.fb.group({
        concepto: [retencion.concepto ?? '', [Validators.required]],
        porcentaje: [retencion.porcentaje ?? '', [Validators.required]]
      });

      // Si no es editable, deshabilitamos los dos campos de este grupo
      if (!this.editable) {
        group.get('concepto')?.disable();
        group.get('porcentaje')?.disable();
      }

      // Añadimos el grupo al FormArray
      retArr.push(group);
    });

    // Si no es editable y quieres deshabilitar también el resto del formulario:
    if (!this.editable) {
      // Deshabilita solo los demás controles del formulario (menos retenciones)
      Object.keys(this.formulario.controls).forEach(key => {
        if (key !== 'retenciones') {
          this.formulario.get(key)?.disable();
        }
      });
    }

    // --- Actualizar validadores dinámicos ---
    this.updateGranContribuyenteValidators((data.granContribuyente ?? '0').toString());
    this.updateAutorretenedorValidators((data.autorretenedor ?? '0').toString());
    this.updateResponsableICAValidators((data.responsableICA ?? '0').toString());

    // --- Forzar render ---
    this.cdr.detectChanges();
  }

  private initializeForm(): void {
    this.formulario = this.fb.group({
      Id: [0],
      IdFormulario: [this.IdFormulario || 0],
      granContribuyente: ['0', [Validators.required, noSeleccionadoValidator()]],
      numResolucionGranContribuyente: [''],
      fechaResolucionGranContribuyente: [''],
      autorretenedor: ['0', [Validators.required, noSeleccionadoValidator()]],
      numResolucionAutorretenedor: [''],
      fechaResolucionAutorretenedor: [''],
      responsableICA: ['0', [Validators.required, noSeleccionadoValidator()]],
      municipioRetener: [''],
      tarifa: [''],
      responsableIVA: ['0', [Validators.required, noSeleccionadoValidator()]],
      agenteRetenedorIVA: ['0', [Validators.required, noSeleccionadoValidator()]],
      regimenTributario: [''],
      Sucursal: [''],
      retenciones: this.fb.array([])
    });
  }



  getRetenciones(): FormArray {
    return this.formulario.get('retenciones') as FormArray;
  }

  crearRetencion(): FormGroup {
    return this.fb.group({
      concepto: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]],
      porcentaje: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]]
    });
  }

  addRetencion(): void {
    this.getRetenciones().push(this.crearRetencion());
  }

  deleteRetencion(index: number): void {
    this.getRetenciones().removeAt(index);
  }

  onSubmit(): void {
    if (!this.formulario.valid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const raw = this.formulario.getRawValue();

    // 🔹 Normalizamos retenciones (array puro)
    const retenciones = Array.isArray(raw.retenciones)
      ? raw.retenciones.map((r: any) => ({
        concepto: r.concepto,
        porcentaje: r.porcentaje
      }))
      : [];

    // 🔹 Normalizamos fechas (backend usa VARCHAR)
    const fechaGran = raw.fechaResolucionGranContribuyente
      ? new Date(raw.fechaResolucionGranContribuyente).toISOString().split('T')[0]
      : null;

    const fechaAuto = raw.fechaResolucionAutorretenedor
      ? new Date(raw.fechaResolucionAutorretenedor).toISOString().split('T')[0]
      : null;

    const payload = {
      ...raw,
      fechaResolucionGranContribuyente: fechaGran,
      fechaResolucionAutorretenedor: fechaAuto,
      retenciones, // array puro, no string
      IdFormulario: this.IdFormulario
    };

    console.log('Payload enviado:', payload);

    this.serviciocliente.GuardarInformacionTriburaria(payload).subscribe({
      next: resp => console.log('Guardado OK', resp),
      error: err => console.error('Error al guardar datos:', err)
    });
  }


  private setupValueChanges(): void {
    this.formulario.get('granContribuyente')?.valueChanges.subscribe(value => {
      this.updateGranContribuyenteValidators(value);
    });

    this.formulario.get('autorretenedor')?.valueChanges.subscribe(value => {
      this.updateAutorretenedorValidators(value);
    });

    this.formulario.get('responsableICA')?.valueChanges.subscribe(value => {
      this.updateResponsableICAValidators(value);
    });
  }

  private updateGranContribuyenteValidators(value: string): void {
    const numResolucionGranContribuyente = this.formulario.get('numResolucionGranContribuyente');
    const fechaResolucionGranContribuyente = this.formulario.get('fechaResolucionGranContribuyente');
    if (value === '0') {
      numResolucionGranContribuyente?.clearValidators();
      fechaResolucionGranContribuyente?.clearValidators();
    } else {
      numResolucionGranContribuyente?.setValidators([Validators.required]);
      fechaResolucionGranContribuyente?.setValidators([Validators.required]);
    }
    numResolucionGranContribuyente?.updateValueAndValidity();
    fechaResolucionGranContribuyente?.updateValueAndValidity();
  }

  private updateAutorretenedorValidators(value: string): void {
    const numResolucionAutorretenedor = this.formulario.get('numResolucionAutorretenedor');
    const fechaResolucionAutorretenedor = this.formulario.get('fechaResolucionAutorretenedor');
    if (value === '0') {
      numResolucionAutorretenedor?.clearValidators();
      fechaResolucionAutorretenedor?.clearValidators();
    } else {
      numResolucionAutorretenedor?.setValidators([Validators.required]);
      fechaResolucionAutorretenedor?.setValidators([Validators.required]);
    }
    numResolucionAutorretenedor?.updateValueAndValidity();
    fechaResolucionAutorretenedor?.updateValueAndValidity();
  }

  private updateResponsableICAValidators(value: string): void {
    const municipioRetener = this.formulario.get('municipioRetener');
    const tarifa = this.formulario.get('tarifa');
    if (value === '0') {
      municipioRetener?.clearValidators();
      tarifa?.clearValidators();
    } else {
      municipioRetener?.setValidators([Validators.required]);
      tarifa?.setValidators([Validators.required]);
    }
    municipioRetener?.updateValueAndValidity();
    tarifa?.updateValueAndValidity();
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
      this.formulario.markAllAsTouched();
    }

    const formRaw = this.formulario.getRawValue();


    const tarifaNum = parseInt(formRaw.tarifa as any, 10);
    formRaw.tarifa = isNaN(tarifaNum) ? 0 : tarifaNum;


    formRaw.retenciones = Array.isArray(formRaw.retenciones)
      ? formRaw.retenciones.map((ret: { concepto: string; porcentaje: string | number }) => ({
        concepto: ret.concepto,
        porcentaje: parseFloat(ret.porcentaje as string) || 0
      }))
      : [];

    return formRaw;
  }

  esFormularioValido() {
    this.marcarFormularioComoTocado()
    return this.formulario.valid;
  }

  marcarFormularioComoTocado() {
    Object.values(this.formulario.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity(); // fuerza recalcular
    });
  }

  ObtenerDivFormulario() {
    const DATA: any = document.getElementById('informacionTriburaria');
    return DATA;
  }

  Desabilitacamposdespuesdeenvio() {
    this.editable = false;
    this.formulario.disable();
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
    this.logInvalidControlsRecursive(this.formulario, 'InfoTributaria');
    const camposInvalidos = [];
    const controles = this.formulario.controls;
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
}
