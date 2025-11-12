import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../Services/main.services';
import { noSeleccionadoValidator } from '../../utils/validcliente/validacionOpcionales';

@Component({
  selector: 'app-cumplimiento-normativo',
  templateUrl: './cumplimiento-normativo.component.html',
  styleUrl: './cumplimiento-normativo.component.scss'
})
export class CumplimientoNormativoComponent {
  formulario: FormGroup;
  private originalValidators: { [key: string]: any } = {};

  @Input() IdEstadoFormulario: number;
  @Input() IdFormulario: number;
  @Input() ListaSino: any[];
  @Input() editable: boolean;
  @Input() tipoTercero: number;

  constructor(private fb: FormBuilder, private translate: TranslateService, private serviciocliente: ServicioPrincipalService) { }



  ngOnInit(): void {

    this.initializeForm();

    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      this.originalValidators[key] = control?.validator;
    });

    if (this.IdFormulario !== 0 && this.IdFormulario !== undefined) {
      this.ConsultaCumplimiento();
    }


  }

  ConsultaCumplimiento() {
    this.serviciocliente.ConsultaCumplimiento(this.IdFormulario).subscribe(data => {

      if (data) {
        this.inicilizarinfogurdada(data)
      }

      if (!this.editable) {

        this.formulario.disable();
      }

    });
  }

  inicilizarinfogurdada(obj: any) {
    this.formulario.patchValue({
      Id: obj.id,
      IdFormulario: obj.idFormulario,
      sometida_sagrilaft: obj.sometida_sagrilaft ? '1' : '0',
      sometida_otro_sistema: obj.sometida_otro_sistema ? '1' : '0',
      adhesion_politicas_samsung: obj.adhesion_politicas_samsung ? '1' : '0',
    //  no_invest_sancion_laftfpadm: obj.no_invest_sancion_laftfpadm ? '1' : '0',
    //  no_transacciones_ilicitas: obj.no_transacciones_ilicitas ? '1' : '0',
    //  acepta_monitoreo_info: obj.acepta_monitoreo_info ? '1' : '0',
    //  no_listas_restrictivas: obj.no_listas_restrictivas ? '1' : '0',
      correo_reportar_incidentes: obj.correo_reportar_incidentes || ''
    });

    this.updateValidators(obj.no_invest_sancion_laftfpadm.toString());
  }


  private initializeForm(): void {
    this.formulario = this.fb.group({
      Id: [0],
      IdFormulario: [this.IdFormulario],
      sometida_sagrilaft: ['-1', [Validators.required, noSeleccionadoValidator()]],
      sometida_otro_sistema: ['-1', [Validators.required, noSeleccionadoValidator()]],
      adhesion_politicas_samsung: ['-1', [Validators.required, noSeleccionadoValidator()]],
      // no_invest_sancion_laftfpadm: ['-1', [Validators.required, noSeleccionadoValidator()]],
      // no_transacciones_ilicitas: ['-1', [Validators.required, noSeleccionadoValidator()]],
      // acepta_monitoreo_info: ['-1', [Validators.required, noSeleccionadoValidator()]],
      // no_listas_restrictivas: ['-1', [Validators.required, noSeleccionadoValidator()]],
      correo_reportar_incidentes: ['', [Validators.required, Validators.email]]
    });

    // this.formulario.get('no_invest_sancion_laftfpadm')?.valueChanges.subscribe((value) => {
    //   this.updateValidators(value);
    // });

  }
  private updateValidators(value: string): void {

    if (value !== '1') {
      this.formulario.get('sometida_otro_sistema')?.clearValidators();
      this.formulario.get('adhesion_politicas_samsung')?.clearValidators();
      // this.formulario.get('no_invest_sancion_laftfpadm')?.clearValidators();
      // this.formulario.get('no_transacciones_ilicitas')?.clearValidators();
      // this.formulario.get('acepta_monitoreo_info')?.clearValidators();
      // this.formulario.get('no_listas_restrictivas')?.clearValidators();
      this.formulario.get('correo_reportar_incidentes')?.setValidators([Validators.required, Validators.email]);

    } else {
      this.formulario.get('sometida_otro_sistema')
        ?.setValidators([Validators.required, noSeleccionadoValidator()]);
      this.formulario.get('adhesion_politicas_samsung')
        ?.setValidators([Validators.required, noSeleccionadoValidator()]);
      // this.formulario.get('no_invest_sancion_laftfpadm')
      //   ?.setValidators([Validators.required, noSeleccionadoValidator()]);
      // this.formulario.get('no_transacciones_ilicitas')
      //   ?.setValidators([Validators.required, noSeleccionadoValidator()]);
      // this.formulario.get('acepta_monitoreo_info')
      //   ?.setValidators([Validators.required, noSeleccionadoValidator()]);
      // this.formulario.get('no_listas_restrictivas')
      //   ?.setValidators([Validators.required, noSeleccionadoValidator()]);
      this.formulario.get('correo_reportar_incidentes')
        ?.setValidators([Validators.required, Validators.email]);
    }

    this.formulario.get('sometida_otro_sistema')?.updateValueAndValidity({ emitEvent: false });
    this.formulario.get('adhesion_politicas_samsung')?.updateValueAndValidity({ emitEvent: false });
    // this.formulario.get('no_invest_sancion_laftfpadm')?.updateValueAndValidity({ emitEvent: false });
    // this.formulario.get('no_transacciones_ilicitas')?.updateValueAndValidity({ emitEvent: false });
    // this.formulario.get('acepta_monitoreo_info')?.updateValueAndValidity({ emitEvent: false });
    // this.formulario.get('no_listas_restrictivas')?.updateValueAndValidity({ emitEvent: false });
    this.formulario.get('correo_reportar_incidentes')?.updateValueAndValidity({ emitEvent: false });
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
    const convertFields = this.formulario.value;
    if(isValid) {
      this.formulario.markAllAsTouched();
      return {
        Id: convertFields.Id,
        IdFormulario: convertFields.IdFormulario,
        sometida_sagrilaft: (convertFields.sometida_sagrilaft === '1'),
        sometida_otro_sistema: (convertFields.sometida_otro_sistema === '1'),
        adhesion_politicas_samsung: (convertFields.adhesion_politicas_samsung === '1'),
        // no_invest_sancion_laftfpadm: (convertFields.no_invest_sancion_laftfpadm === '1'),
        // no_transacciones_ilicitas: (convertFields.no_transacciones_ilicitas === '1'),
        // acepta_monitoreo_info: (convertFields.acepta_monitoreo_info === '1'),
        // no_listas_restrictivas: (convertFields.no_listas_restrictivas === '1'),
        correo_reportar_incidentes: convertFields.correo_reportar_incidentes
      };
    }

    return {
      Id: convertFields.Id,
      IdFormulario: convertFields.IdFormulario,
      sometida_sagrilaft: (convertFields.sometida_sagrilaft === '1'),
      sometida_otro_sistema: (convertFields.sometida_otro_sistema === '1'),
      adhesion_politicas_samsung: (convertFields.adhesion_politicas_samsung === '1'),
      // no_invest_sancion_laftfpadm: (convertFields.no_invest_sancion_laftfpadm === '1'),
      // no_transacciones_ilicitas: (convertFields.no_transacciones_ilicitas === '1'),
      // acepta_monitoreo_info: (convertFields.acepta_monitoreo_info === '1'),
      // no_listas_restrictivas: (convertFields.no_listas_restrictivas === '1'),
      correo_reportar_incidentes: convertFields.correo_reportar_incidentes
    };
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
    const DATA: any = document.getElementById('CumplimientoNormDiv');

    return DATA;
  }


  Desabilitacamposdespuesdeenvio() {
    this.editable = false;
    this.formulario.disable()
  }

  submit() {
    const invalidFields = this.obtenerCamposInvalidos();
    console.log('Campos inválidos:', invalidFields);

    const formValue = this.formulario.value;
    console.log(JSON.stringify(formValue, null, 2));

    this.marcarFormularioComoTocado();
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
      this.logInvalidControlsRecursive(this.formulario, 'CumplimientoNormativo');
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
