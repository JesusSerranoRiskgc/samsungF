import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ServicioPrincipalService } from '../../Services/main.services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list-registro-tiempo',
  templateUrl: './list-registro-tiempo.component.html',
  styleUrls: ['./list-registro-tiempo.component.scss']
})
export class ListRegistroTiempoComponent {
  JuntaDirectiva: FormGroup;
  Lang: string = 'es';
  ListaTipoDocumentos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private serviciocliente: ServicioPrincipalService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('es');
    this.Lang = localStorage.getItem('language') || 'es';
    this.translate.use(this.Lang);
    this.JuntaDirectiva = this.fb.group({
      Directivos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadTiposDocumentos();


  }

  loadTiposDocumentos(): void {
    this.serviciocliente.ListaTiposDocumentos(this.Lang).subscribe(data => {
      this.ListaTipoDocumentos = data;
    });
  }

 
  // Obtener el FormArray de Representantes
  get directivo() {
    return this.JuntaDirectiva.get('Directivos') as FormArray;
  }

  // Agregar un nuevo representante
  addDirectivo() {
    this.directivo.push(this.crearDirectivo());
  }

  // Quitar representante
  removeDirectivo(index: number) {
    this.directivo.removeAt(index);
  }

  // Crear el grupo de un representante, incluyendo el array de cargos públicos
  crearDirectivo(): FormGroup {
    return this.fb.group({
      NombreCompleto: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      NumeroIdentificacion: [''],
      Nacionalidad:[''],
      vinculadoPep: [''],//si si preguntas
      ManejaRecursos: ['', Validators.required],
      CualesRecursos: ['', Validators.required],
      PoderPolitico: ['', Validators.required],
      RamaPoderPublico: ['', Validators.required],

      CargoPublico: ['', Validators.required],
      CualCargoPublico: ['', Validators.required],

      ObligacionTributaria: ['', Validators.required],
      PaisesObligacionTributaria: ['', Validators.required],

      CuentasFinancierasExt: ['', Validators.required],
      PaisesCuentasExt: ['', Validators.required],

      TienePoderCuentaExtranjera: ['', Validators.required],
      PaisesPoderCuentaExtranjera: ['', Validators.required],

      hasidoPep2: [''], 
      cargosPublicos: this.fb.array([]),

      Tienevinculosmas5: ['', Validators.required],
      Vinculosmas: this.fb.array([]),

      InfoFamiliaPep: this.fb.array([]),
       //cargosPublicos: this.fb.array([this.crearcargospublicos()]) // Array de ca// Array de cargos públicos
    });
  }

  // Obtener el FormArray de cargos públicos para un representante específico
  getCargosPublicos(representanteIndex: number): FormArray {
    return this.directivo.at(representanteIndex).get('cargosPublicos') as FormArray;
  }


  crearcargospublicos()
  {
    return this.fb.group({
      NombreEntidad: ['', Validators.required],
      FechaIngreso: ['', Validators.required],
      FechaDesvinculacion: ['']});
  }

  removeCargoPublico(representanteIndex: number, cargoIndex: number) {
    const cargosPublicos = this.getCargosPublicos(representanteIndex);
    cargosPublicos.removeAt(cargoIndex);
  }

  removeVinculomas5(representanteIndex: number, cargoIndex: number) {
    const vinculomas5 = this.getVinculomas5(representanteIndex);
    vinculomas5.removeAt(cargoIndex);
  }


  // Agregar un cargo público cuando `hasidoPep2` es "si"
  addCargoPublico(representanteIndex: number) {
    const cargosPublicos = this.getCargosPublicos(representanteIndex);
    const cargoPublicoForm = this.fb.group({
      NombreEntidad: [''],
      FechaIngreso: [''],
      FechaDesvinculacion: [''],

    });
    cargosPublicos.push(cargoPublicoForm);
  }

  addVinculomas5(representanteIndex: number) {
    const vinculosmas5 = this.getVinculomas5(representanteIndex);
    const vinculosmas5Form = this.fb.group({
      NombreCompleto: [''],
      TipoIdentificacion: [''],
      NumeroIdentificacion: [''],
      Pais: [''],
      PorcentajeParticipacion: [''],

    });
    vinculosmas5.push(vinculosmas5Form);
  }

  getVinculomas5(vinculomas5Index: number): FormArray {
    return this.directivo.at(vinculomas5Index).get('Vinculosmas') as FormArray;
  }


  getInfoFamiliar(indofamiliarIndex: number): FormArray {
    return this.directivo.at(indofamiliarIndex).get('InfoFamiliaPep') as FormArray;
  }

  addInfoFamilia(representanteIndex: number) {
    const InfoFamilia = this.getInfoFamiliar(representanteIndex);
    const InfoFamiliaForm = this.fb.group({
      NombreCompleto: [''],
      TipoIdentificacion: [''],
      NumeroIdentificacion: [''],
      Nacionalidad: [''],
      CargoContacto: [''],
      FechaNombramiento: [''],
      FechaFinalizacion: [''],
      VinculoFamiliar: [''],

    });
    InfoFamilia.push(InfoFamiliaForm);
  }

  removeInfoFamilia(representanteIndex: number, FamilairIndex: number) {
    const InfoFamilia = this.getInfoFamiliar(representanteIndex);
    InfoFamilia.removeAt(FamilairIndex);
  }


  // Enviar el formulario completo
  submit() {
    if (!this.JuntaDirectiva.valid) {
      const formValue = this.JuntaDirectiva.value; // Obtiene el valor del formulario
      console.log(JSON.stringify(formValue,null,2));
    }
  }
}