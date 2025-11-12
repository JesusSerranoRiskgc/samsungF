import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../Services/main.services';
import { InformacionComplementariaDto } from './../../Models/InformacionComplementariaDto';

@Component({
  selector: 'app-informacion-complementaria',
  templateUrl: './informacion-complementaria.component.html'
})
export class InformacionComplementariaComponent implements OnInit {
  @Input() IdEstadoFormulario: number;
  @Input() IdFormulario: number;
  @Input() ListaSino: any[];
  @Input() editable: boolean;
  @Input() tipoTercero: number;

  formulario: FormGroup;

  private originalValidators: { [key: string]: any } = {};


  constructor(
    private fb: FormBuilder,
    private infoCompService: ServicioPrincipalService
  ) { }

  ngOnInit(): void {
    this.crearFormulario();

    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      this.originalValidators[key] = control?.validator;
    });

    if (this.IdFormulario) {
      this.cargarInformacionComplementaria(this.IdFormulario);
    }

    if (!this.editable) {
      this.formulario.disable();
    }
  }

  crearFormulario(): void {
    this.formulario = this.fb.group({
      Id: [0],
      IdFormulario: [this.IdFormulario],

    //  ActivosVirtuales: [false],
    //  GrandesCantidadesEfectivo: [false],

      InvestigadoViolacionLeyesAnticorrupcion: [false],
      DeclaracionNoToleranciaCorrupcion: [false],
      ExtensionColaboradoresPolitica: [false],
      PoliticaAportesDonaciones: [false],
      ContratadoTercerosOrganizacion: [false],

      ObligadaSistemaPrevencionLAFT: [false],
      TieneSistemaPrevencionLAFT: [false],
      CasoRespuestaSistemaLAFT: [false],
      AdopcionPoliticasLAFT: [false],
      NombramientoOficialCumplimiento: [false],
      MedidasDebidaDiligencia: [false],
      IdentificacionEvaluacionRiesgos: [false],
      IdentificacionReporteSospechosas: [false],
      PoliticasCapacitacionLAFT: [false],

      // ObligadoAutocontrolLAFT: [false],
      ObligadoProgramaPTEE: [false],
      AdopcionPoliticasOrganoDireccion: [false],
      EstablecimientoMedidasDebidaDiligencia: [false],
      IdentificacionReportesOperSospechosas: [false],
      RiesgosCorrupcionSobornoTransnacional: [false],
      RiesgosLAFT: [false],
      PoliticasCapacitacion: [false]
    });
  }

  cargarInformacionComplementaria(idFormulario: number): void {
    this.infoCompService
      .ConsultarInformacionComplementaria(idFormulario)
      .subscribe({
        next: (data) => {
          if (!data) return;

          if (data) {
            this.formulario.patchValue({
              Id: data.id,
              idFormulario: data.idFormulario,
            //  ActivosVirtuales: data.activosVirtuales,
             // GrandesCantidadesEfectivo: data.grandesCantidadesEfectivo,
              InvestigadoViolacionLeyesAnticorrupcion: data.investigadoViolacionLeyesAnticorrupcion,
              DeclaracionNoToleranciaCorrupcion: data.declaracionNoToleranciaCorrupcion,
              ExtensionColaboradoresPolitica: data.extensionColaboradoresPolitica,
              PoliticaAportesDonaciones: data.politicaAportesDonaciones,
              ContratadoTercerosOrganizacion: data.contratadoTercerosOrganizacion,
              ObligadaSistemaPrevencionLAFT: data.obligadaSistemaPrevencionLAFT,
              TieneSistemaPrevencionLAFT: data.tieneSistemaPrevencionLAFT,
              CasoRespuestaSistemaLAFT: data.casoRespuestaSistemaLAFT,
              AdopcionPoliticasLAFT: data.adopcionPoliticasLAFT,
              NombramientoOficialCumplimiento: data.nombramientoOficialCumplimiento,
              MedidasDebidaDiligencia: data.medidasDebidaDiligencia,
              IdentificacionEvaluacionRiesgos: data.identificacionEvaluacionRiesgos,
              IdentificacionReporteSospechosas: data.identificacionReporteSospechosas,
              PoliticasCapacitacionLAFT: data.politicasCapacitacionLAFT,
              // ObligadoAutocontrolLAFT: data.obligadoAutocontrolLAFT,
              ObligadoProgramaPTEE: data.obligadoProgramaPTEE,
              AdopcionPoliticasOrganoDireccion: data.adopcionPoliticasOrganoDireccion,
              EstablecimientoMedidasDebidaDiligencia: data.establecimientoMedidasDebidaDiligencia,
              IdentificacionReportesOperSospechosas: data.identificacionReportesOperSospechosas,
              RiesgosCorrupcionSobornoTransnacional: data.riesgosCorrupcionSobornoTransnacional,
              RiesgosLAFT: data.riesgosLAFT,
              PoliticasCapacitacion: data.politicasCapacitacion

            });

          }
        },
        error: (err: any) => console.error('Error al cargar info complementaria', err)


      });
  }

  guardarInformacionComplementaria(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const dto: InformacionComplementariaDto = this.formulario.value;

    this.infoCompService.GuardarInformacionComplementaria(dto).subscribe({
      next: (res: any) => {
        console.log('Guardado con éxito', res);
      },
      error: (err: any) => {
        console.error('Error al guardar', err);
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
      return this.formulario.value;
    } else {
      return this.formulario.value;
    }
  }
}
