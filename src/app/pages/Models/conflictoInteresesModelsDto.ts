export interface Parentesco {
    nombre: string;
    tipoRelacion: string;
}

export interface Inversiones {
    tipoTitulo: string;
    cantidadTitulos: number;
    valorTitulos: number;
}

export interface Pep {
    relacion: string;
    nombreCargoEntidad: string;
    fechasVinculacionEstado: string;
}

export interface Socio {
    entidad: string;
    tipoParticipacion: string;
    fechas: string;
}

export interface Relaciones {
    entidad: string;
    tipoRelacion: string;
    fechas: string;
}


export interface Directivo {
    entidad: string;
    tipoParticipacion: string;
    fechas: string;
}

export interface Confidencialidad {
    entidad: string;
    descripcion: string;
    fechas: string;
}