import { AfterViewInit, ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServicioPrincipalService } from '../Services/main.services';
import { InternalDataService } from '../Services/InternalDataService';
import { AlertModalComponent } from '../utils/alert-modal/alert-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-informacion-interna-oea',
  templateUrl: './informacion-interna-oea.component.html',
  styleUrl: './informacion-interna-oea.component.scss'
})
export class InformacionInternaOEAComponent implements OnInit, AfterViewInit {
  private modalService = inject(NgbModal);
  @Input() IdFormulario: number;
  idClaseTercero: string;
  formulario: FormGroup;

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef, private internalservicet: InternalDataService, private serviciocliente: ServicioPrincipalService) {
    this.formulario = this.fb.group({
      IdFormulario:[this.IdFormulario],
      uen: [''],
      responsableVenta: [''],
      correoElectronico: [''],
      responsableCartera: [''],
      responsableTecnico: [''],
      moneda: [''],
      formaPago: [''],
      numeroDias: [''],
      cadenaLogistica: [''],
      listasRiesgo: [''],
      sustanciasNarcoticos: [''],
      certificaciones: [''],
      proveedorCadenaLogistica: [''],
      riesgoPais: [''],
      antiguedadEmpresa: [''],
      riesgoSeguridad: [''],
      valoracion: [''],
      listasRiesgoCliente: [''],
      tipoNegociacion: [''],
      vistoBuenoAseguradora: [''],
      riesgoPaisCliente: [''],
      certificacionesInstitucionalidad: [''],
      riesgoSeguridadCliente: [''],
      valoracionCliente: [''],
      segmentacionRiesgo: ['']
    });
  }

  /*constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef, private internalservicet: InternalDataService, private serviciocliente: ServicioPrincipalService) {
    this.formulario = this.fb.group({
      IdFormulario:[this.IdFormulario],
      uen: ['', Validators.required],
      responsableVenta: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      responsableCartera: ['', Validators.required],
      responsableTecnico: ['', Validators.required],
      moneda: ['', Validators.required],
      formaPago: ['', Validators.required],
      numeroDias: ['', Validators.required],
      cadenaLogistica: ['', Validators.required],
      listasRiesgo: [''],
      sustanciasNarcoticos: ['', Validators.required],
      certificaciones: ['', Validators.required],
      proveedorCadenaLogistica: ['', Validators.required],
      riesgoPais: ['', Validators.required],
      antiguedadEmpresa: ['', Validators.required],
      riesgoSeguridad: ['', Validators.required],
      valoracion: ['', Validators.required],
      listasRiesgoCliente: [''],
      tipoNegociacion: ['', Validators.required],
      vistoBuenoAseguradora: ['', Validators.required],
      riesgoPaisCliente: ['', Validators.required],
      certificacionesInstitucionalidad: ['', Validators.required],
      riesgoSeguridadCliente: ['', Validators.required],
      valoracionCliente: ['', Validators.required],
      segmentacionRiesgo: ['']
    });
  }*/

  ngOnInit(): void {

    this.serviciocliente.ConsultaDatosGenerales(this.IdFormulario).subscribe(data => {
     /* if (data) {
       /* this.idClaseTercero = data.claseTercero.toString();
        if (this.idClaseTercero === '2') {
          this.formulario.get('responsableVenta')?.clearValidators();
          this.formulario.get('correoElectronico')?.clearValidators();
          this.formulario.get('responsableCartera')?.clearValidators();
          this.formulario.get('responsableTecnico')?.clearValidators();
          this.formulario.get('moneda')?.clearValidators();
        } else {
          this.formulario.get('responsableVenta')?.setValidators([Validators.required]);
          this.formulario.get('correoElectronico')?.setValidators([Validators.required]);
          this.formulario.get('responsableCartera')?.setValidators([Validators.required]);
          this.formulario.get('responsableTecnico')?.setValidators([Validators.required]);
          this.formulario.get('moneda')?.setValidators([Validators.required]);
        }

        if (data.pais === '43') {
          this.formulario.get('tipoNegociacion')?.clearValidators();
          this.formulario.get('vistoBuenoAseguradora')?.clearValidators();
          this.formulario.get('riesgoPaisCliente')?.clearValidators();
          this.formulario.get('certificacionesInstitucionalidad')?.clearValidators();
          this.formulario.get('riesgoSeguridadCliente')?.clearValidators();
          this.formulario.get('valoracionCliente')?.clearValidators();
        } else {
          this.formulario.get('tipoNegociacion')?.setValidators([Validators.required]);
          this.formulario.get('vistoBuenoAseguradora')?.setValidators([Validators.required])
          this.formulario.get('riesgoPaisCliente')?.setValidators([Validators.required])
          this.formulario.get('certificacionesInstitucionalidad')?.setValidators([Validators.required])
          this.formulario.get('riesgoSeguridadCliente')?.setValidators([Validators.required])
          this.formulario.get('valoracionCliente')?.setValidators([Validators.required])

        }
        this.formulario.get('responsableVenta')?.updateValueAndValidity();
        this.formulario.get('correoElectronico')?.updateValueAndValidity();
        this.formulario.get('responsableCartera')?.updateValueAndValidity();
        this.formulario.get('responsableTecnico')?.updateValueAndValidity();
        this.formulario.get('moneda')?.updateValueAndValidity();
        this.formulario.get('tipoNegociacion')?.updateValueAndValidity();
        this.formulario.get('vistoBuenoAseguradora')?.updateValueAndValidity();
        this.formulario.get('riesgoPaisCliente')?.updateValueAndValidity();
        this.formulario.get('certificacionesInstitucionalidad')?.updateValueAndValidity();
        this.formulario.get('riesgoSeguridadCliente')?.updateValueAndValidity();
        this.formulario.get('valoracionCliente')?.updateValueAndValidity();

      }*/
    });


    this.formulario.patchValue({
      IdFormulario:this.IdFormulario,});


    this.ConsultaInformacionOEA();

  }

  ConsultaInformacionOEA (){

    this.serviciocliente.ConsultainfoOEA(this.IdFormulario).subscribe(data => {     
      if (data)
        {
        this.inicilizarinfogurdada(data)
        }
});


  }


  inicilizarinfogurdada(obj:any)
  {
    
    this.formulario.patchValue({
      uen: obj.uen,
      responsableVenta: obj.responsableVenta,
      correoElectronico: obj.correoElectronico,
      responsableCartera: obj.responsableCartera,
      responsableTecnico: obj.responsableTecnico,
      moneda: obj.moneda,
      formaPago:obj.formaPago,
      numeroDias:obj.numeroDias,
      cadenaLogistica: obj.cadenaLogistica,
      listasRiesgo: obj.listasRiesgo,
      sustanciasNarcoticos: obj.sustanciasNarcoticos,
      certificaciones:obj.certificaciones,
      proveedorCadenaLogistica:obj.proveedorCadenaLogistica,
      riesgoPais: obj.riesgoPais,
      antiguedadEmpresa: obj.antiguedadEmpresa,
      riesgoSeguridad: obj.riesgoSeguridad,
      valoracion: obj.valoracion,
      listasRiesgoCliente: obj.listasRiesgoCliente,
      tipoNegociacion: obj.tipoNegociacion,
      vistoBuenoAseguradora: obj.vistoBuenoAseguradora,
      riesgoPaisCliente: obj.riesgoPaisCliente,
      certificacionesInstitucionalidad: obj.certificacionesInstitucionalidad,
      riesgoSeguridadCliente: obj.riesgoSeguridadCliente,
      valoracionCliente: obj.valoracionCliente,
      segmentacionRiesgo:obj.segmentacionRiesgo,
    });


  }

  onSubmit(): void {
    if (this.formulario.valid) {
      const formData: FormularioModel = this.formulario.value;
      this.serviciocliente.GuardarInfoOEA(formData).subscribe(
        (response) => {
         // this.isLoading = false;
          const modalRef = this.modalService.open(AlertModalComponent);
          modalRef.componentInstance.name = 'Usuario creado correctamente';
          modalRef.componentInstance.title = '';

        },
        (error) => {
          //this.isLoading = false;
          const modalRef = this.modalService.open(AlertModalComponent);
          modalRef.componentInstance.name = error.error;
          modalRef.componentInstance.title = 'Error';

          //this.resetForm();
        }
      );
    } else {
     this.marcarFormularioComoTocado();
    }
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();

  }


  marcarFormularioComoTocado()
  {
    Object.values(this.formulario.controls).forEach(control => {
      control.markAsTouched();
    });
  }

}


export interface FormularioModel {
  IdFormulario: string;
  uen: string;  
  responsableVenta: string;
  correoElectronico: string;
  responsableCartera: string;
  responsableTecnico: string;
  moneda: string;
  formaPago: string;
  numeroDias: number;
  cadenaLogistica: string;
  listasRiesgo: string;
  sustanciasNarcoticos: string;
  certificaciones: string;
  proveedorCadenaLogistica: string;
  riesgoPais: string;
  antiguedadEmpresa: string;
  riesgoSeguridad: string;
  valoracion: string;
  listasRiesgoCliente: string;
  tipoNegociacion: string;
  vistoBuenoAseguradora: string;
  riesgoPaisCliente: string;
  certificacionesInstitucionalidad: string;
  riesgoSeguridadCliente: string;
  valoracionCliente: string;
  segmentacionRiesgo: string; // Opcional
}