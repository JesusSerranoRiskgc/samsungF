import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Parentesco, Inversiones, Pep, Directivo, Socio, Relaciones, Confidencialidad } from '../../Models/conflictoInteresesModelsDto';
import { ServicioPrincipalService } from '../../Services/main.services';

@Component({
  selector: 'app-conflicto-interes',
  templateUrl: './conflicto-interes.component.html',
  styleUrls: ['./conflicto-interes.component.scss']
})
export class ConflictoInteresComponent implements OnInit {
  @Input() IdEstadoFormulario: number;
  @Input() IdFormulario: number;
  @Input() ListaSino: any[];
  @Input() editable: boolean;
  @Input() tipoTercero: number;

  formulario: FormGroup;
  private originalValidators: { [key: string]: any } = {};

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private servicioPrincipal: ServicioPrincipalService, private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.crearFormulario();          // Crea el formulario y los formArray vacíos
    this.setupDynamicValidation();

    // 🔹 Cargar datos apenas inicia
    this.cargarDatosConflicto(this.IdFormulario);

    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      this.originalValidators[key] = control?.validator;
    });



    if (!this.editable) {
      this.formulario.disable();
    }
  }

  Desabilitacamposdespuesdeenvio() {
    this.editable = false;
    this.formulario.disable();
    this.IdEstadoFormulario = 3;
    this.cdr.detectChanges();
  }





  // validar el valor de los campos
  private requireAtLeastOneEntry(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      return formArray.length > 0 ? null : { required: true };
    };
  }

  crearFormulario(): void {
    this.formulario = this.fb.group({
      Id: [0],
      conoceProcedimientoConflicto: [false, Validators.required],
      razonNoConocerProcedimientoConflicto: [''],
      entidadesRelacionSamsung: this.fb.array([], this.requireAtLeastOneEntry()),
      otrasSituacionesConflicto: [null, Validators.required],
      actividadesCompetidor: [false, Validators.required],
      razonActividadesCompetidor: [''],
      relacionesEstado: [false, Validators.required],
      razonRelacionesEstado: [''],
      regalosHospitalidad: [false, Validators.required],
      razonRegalosHospitalidad: [''],
      parentescosTercerGrado: this.fb.array([], this.requireAtLeastOneEntry()),
      otrasSituacionesAfectanIndependencia: [false, Validators.required],
      razonOtrasSituacionesAfectanIndependencia: [''],
      influenciaIndebidaPoliticas: [false, Validators.required],
      influenciaIndebidaAdjudicaciones: [false, Validators.required],
      descuentoReventa: [false, Validators.required],
      actividadesRegulatorias: [false, Validators.required],
      corredorIntermediario: [false, Validators.required],
      regalosFuncionarios: [false, Validators.required],
      apruebaTransaccionesConflicto: [false, Validators.required]

    });
  }

  // Get FormArrays
  get entidadesRelacionSamsungArr(): FormArray {
    return this.formulario.get('entidadesRelacionSamsung') as FormArray;
  }
  get parentescosArr(): FormArray {
    return this.formulario.get('parentescosTercerGrado') as FormArray;
  }

  private setupDynamicValidation() {
    const booleanFieldsWithReasons = [
      { field: 'conoceProcedimientoConflicto', reason: 'razonNoConocerProcedimientoConflicto', condition: (val: boolean) => val === false },
      { field: 'actividadesCompetidor', reason: 'razonActividadesCompetidor', condition: (val: boolean) => val === true },
      { field: 'relacionesEstado', reason: 'razonRelacionesEstado', condition: (val: boolean) => val === true },
      { field: 'regalosHospitalidad', reason: 'razonRegalosHospitalidad', condition: (val: boolean) => val === true },
      { field: 'otrasSituacionesAfectanIndependencia', reason: 'razonOtrasSituacionesAfectanIndependencia', condition: (val: boolean) => val === true }
    ];

    booleanFieldsWithReasons.forEach(({ field, reason, condition }) => {
      this.formulario.get(field)?.valueChanges.subscribe((valor: boolean) => {
        const reasonControl = this.formulario.get(reason);
        if (condition(valor)) {
          reasonControl?.setValidators([Validators.required]);
        } else {
          reasonControl?.clearValidators();
          reasonControl?.reset();
        }
        reasonControl?.updateValueAndValidity();
      });
    });
  }

  // Add fields to FormArrays
  agregarEntidadRelacionSamsung(): void {
    this.entidadesRelacionSamsungArr.push(
      this.fb.group({
        entidad: [null, Validators.required],
        tipoRelacion: [null, Validators.required],
        fechas: [null, Validators.required]
      })
    );
  }
  eliminarEntidadRelacionSamsung(index: number): void {
    this.entidadesRelacionSamsungArr.removeAt(index);
  }

  agregarParentesco(): void {
    this.parentescosArr.push(
      this.fb.group({
        nombre: [null, Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)],
        tipoRelacion: [null, Validators.required]
      })
    );
  }
  eliminarParentesco(index: number): void {
    this.parentescosArr.removeAt(index);
  }

  guardarConflicto(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const formValue = this.formulario.value;

    // Convert FormArrays to JSON strings
    formValue.entidadesRelacionSamsung = JSON.stringify(formValue.entidadesRelacionSamsung);
    formValue.parentescosTercerGrado = JSON.stringify(formValue.parentescosTercerGrado);

    this.servicioPrincipal.GuardarConflictoIntereses(formValue).subscribe({
      next: (resp) => {
        console.log('Guardado con éxito', resp);
      },
      error: (err) => {
        console.error('Error al guardar', err);
      }
    });
  }
  obtenerCamposInvalidos(): string[] {
    const invalidFields: string[] = [];

    const checkControl = (control: AbstractControl, path: string) => {
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(key => {
          checkControl(control.controls[key], `${path}.${key}`);
        });
      } else if (control instanceof FormArray) {
        control.controls.forEach((innerCtrl, index) => {
          checkControl(innerCtrl, `${path}[${index}]`);
        });
      } else {
        if (control.invalid) invalidFields.push(path);
      }
    };

    Object.keys(this.formulario.controls).forEach(key => {
      checkControl(this.formulario.get(key)!, key);
    });

    return invalidFields;
  }

  cargarDatosConflicto(idFormulario: number): void {
    this.servicioPrincipal.ConsultaConflictoIntereses(idFormulario).subscribe({
      next: (data) => {
  
        if (!data) return;

        // 🔹 Siempre devuelve array
        const parseOrUse = (field: any): any[] => {
          if (field === null || field === undefined) return [];

          // Si es string, intentar parsear
          if (typeof field === 'string') {
            try {
              const parsed = JSON.parse(field);
              return Array.isArray(parsed) ? parsed : [parsed];
            } catch {
              return [];
            }
          }

          // Si ya es array
          if (Array.isArray(field)) return field;

          // Si es objeto único
          if (typeof field === 'object') return [field];

          return [];
        };

        // 🔹 Limpiar arrays antes de llenarlos
        this.entidadesRelacionSamsungArr.clear();
        this.parentescosArr.clear();

        // 🔹 Llenar entidadesRelacionSamsung
        const entidades = parseOrUse(data.entidadesRelacionSamsung);
        entidades.forEach((item: any) => {
          this.entidadesRelacionSamsungArr.push(
            this.fb.group({
              entidad: [item.entidad ?? '', Validators.required],
              tipoRelacion: [item.tipoRelacion ?? '', Validators.required],
              fechas: [item.fechas ?? '', Validators.required]
            })
          );
        });

        // 🔹 Llenar parentescosTercerGrado
        const parentescos = parseOrUse(data.parentescosTercerGrado);
        parentescos.forEach((item: any) => {
          this.parentescosArr.push(
            this.fb.group({
              nombre: [
                item.nombre ?? '',
                [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]
              ],
              tipoRelacion: [item.tipoRelacion ?? '', Validators.required]
            })
          );
        });

        // 🔹 Patch al resto del formulario
        this.formulario.patchValue({
          Id: data.id,
          conoceProcedimientoConflicto: data.conoceProcedimientoConflicto,
          razonNoConocerProcedimientoConflicto: data.razonNoConocerProcedimientoConflicto,
          otrasSituacionesConflicto: data.otrasSituacionesConflicto,
          actividadesCompetidor: data.actividadesCompetidor,
          razonActividadesCompetidor: data.razonActividadesCompetidor,
          relacionesEstado: data.relacionesEstado,
          razonRelacionesEstado: data.razonRelacionesEstado,
          regalosHospitalidad: data.regalosHospitalidad,
          razonRegalosHospitalidad: data.razonRegalosHospitalidad,
          otrasSituacionesAfectanIndependencia: data.otrasSituacionesAfectanIndependencia,
          razonOtrasSituacionesAfectanIndependencia: data.razonOtrasSituacionesAfectanIndependencia,
          influenciaIndebidaPoliticas: data.influenciaIndebidaPoliticas,
          influenciaIndebidaAdjudicaciones: data.influenciaIndebidaAdjudicaciones,
          descuentoReventa: data.descuentoReventa,
          actividadesRegulatorias: data.actividadesRegulatorias,
          corredorIntermediario: data.corredorIntermediario,
          regalosFuncionarios: data.regalosFuncionarios,
          apruebaTransaccionesConflicto: data.apruebaTransaccionesConflicto
        });

        console.log('formulario con datos', this.entidadesRelacionSamsungArr.value);

        // Si usas ChangeDetectionStrategy.OnPush
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargarDatosConflicto', err)
    });
  }




  removeValidators(): void {
    if (!this.formulario) {
      console.warn('Formulario no definido en ConflictoInteresComponent');
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
      if (control instanceof FormArray) {
        control.controls.forEach(innerControl => {
          if (innerControl instanceof FormGroup) {
            Object.values(innerControl.controls).forEach(innerInnerControl => {
              innerInnerControl.markAsTouched();
            });
          } else {
            innerControl.markAsTouched();
          }
        });
      } else if (control instanceof FormGroup) {
        Object.values(control.controls).forEach(innerControl => {
          innerControl.markAsTouched();
        });
      }
      control.markAsTouched();
    });
  }
}
