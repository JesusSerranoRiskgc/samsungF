export interface CargoPublico {
    NombreEntidad: string;
    FechaIngreso: string;
    FechaDesvinculacion: string;
  }
  
  export interface Vinculo {
    NombreCompleto: string;
    TipoIdentificacion: string;
    NumeroIdentificacion: string;
    Pais: string;
    PorcentajeParticipacion: string;
  }
  
  export interface InfoFamiliaPep {
    NombreCompleto: string;
    TipoIdentificacion: string;
    NumeroIdentificacion: string;
    Nacionalidad: string;
    VinculoFamiliar: string;
  }
  
  export interface Beneficiario {
    NombreCompleto: string;
    tipoDocumento: string;
    NumeroIdentificacion: string;
    Nacionalidad: string;
    Porcentajeparticipacion: string;
    vinculadoPep: string;
    ManejaRecursos: string;
    CualesRecursos: string;
    PoderPolitico: string;
    RamaPoderPublico: string;
    CargoPublico: string;
    CualCargoPublico: string;
    ObligacionTributaria: string;
    PaisesObligacionTributaria: string;
    CuentasFinancierasExt: string;
    PaisesCuentasExt: string;
    TienePoderCuentaExtranjera: string;
    PaisesPoderCuentaExtranjera: string;
    hasidoPep2: string;
    cargosPublicos: CargoPublico[];
    Tienevinculosmas5: string;
    Vinculosmas: Vinculo[];
    InfoFamiliaPep: InfoFamiliaPep[];
  }
  
  export interface Accionista {
    NombreCompleto: string;
    tipoDocumento: string;
    NumeroIdentificacion: string;
    Nacionalidad: string;
    Porcentajeparticipacion: number;
    vinculadoPep: string;
    ManejaRecursos: string;
    CualesRecursos: string;
    PoderPolitico: string;
    RamaPoderPublico: string;
    CargoPublico: string;
    CualCargoPublico: string;
    ObligacionTributaria: string;
    PaisesObligacionTributaria: string;
    CuentasFinancierasExt: string;
    PaisesCuentasExt: string;
    TienePoderCuentaExtranjera: string;
    PaisesPoderCuentaExtranjera: string;
    hasidoPep2: string;
    cargosPublicos: CargoPublico[];
    Tienevinculosmas5: string;
    Vinculosmas: Vinculo[];
    InfoFamiliaPep: InfoFamiliaPep[];
    BeneficiariosFinales: { Beneficiario: Beneficiario[] }[];
  }
  
  export interface RootObject {
    Accionista: Accionista[];
  }
  