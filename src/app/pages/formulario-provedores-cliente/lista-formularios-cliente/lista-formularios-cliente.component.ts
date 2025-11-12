import { Component, ComponentFactoryResolver, ElementRef, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';

import { ServicioPrincipalService } from '../../Services/main.services';
import { NgbModal, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ConfirmDeleteModalComponent } from '../../utils/confirm-delete-modal/confirm-delete-modal.component';
import { InternalDataService } from '../../Services/InternalDataService';
import { Router } from '@angular/router';
import { AlertModalComponent } from '../../utils/alert-modal/alert-modal.component';
import { FormularioProveedoresClientesComponent } from '../formulario-proveedores-clientes-creacion/formulario-proveedores-clientes.component';
import { FormularioProovedoresClienteEdicionComponent } from '../formulario-proovedores-cliente-edicion/formulario-proovedores-cliente-edicion.component';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../../auth/authservices/auth.services';
import { ResultadoListasInspektorComponent } from '../../utils/resultado-listas-inspektor/resultado-listas-inspektor.component';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-lista-formularios-cliente',
  templateUrl: './lista-formularios-cliente.component.html',
  styleUrl: './lista-formularios-cliente.component.scss'
})
export class ListaFormulariosClienteComponent {
  @ViewChild('modalTerminos') modalTerminos: ElementRef;

  @ViewChild('modalTerminosEN') modalTerminosEN: ElementRef;

  Lang:string='es';
  private tokenKey = 'auth_token';
  dataSource: any[] = [];
  filteredDataSource:any[] = [];
  totalItems = 0; // Inicializado a 0
  currentPage = 1;
  pageSize = 5; // Cambiado a 5 por defecto
  isLoading = false;
  searchTerm: string = '';
  userId:number;
  NombreRol:string = '';

  authorizeTreatment: boolean = false;
  authorizeCommercial: boolean = false;
  acceptTerms: boolean = false;


  esPersonaNatural: boolean = false;
  esPersonaJuridica: boolean = true;


  selectedStatus: string = '';
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private servicioautht:AuthService,private serviciocliente: ServicioPrincipalService, private paginationConfig: NgbPaginationConfig,private modalService: NgbModal,private ServicioEdit:InternalDataService,private router: Router,private renderer: Renderer2, private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,private translate: TranslateService) {
    this.paginationConfig.boundaryLinks = true;
    this.paginationConfig.rotate = true;
      this.userId=this.getUsuerId();

      this.Lang = localStorage.getItem('language') || 'es';
      this.translate.use(this.Lang);

  }

  ngOnInit() {

    this.serviciocliente.CurrentUser().pipe(
      catchError((error) => {
        this.servicioautht.logout();
        return of(null);
      })
    ).subscribe((data: any) => {
    this.NombreRol=data.rol;
  });

   this.loadItems();
  
  }

  loadItems() {
    this.isLoading = true;
    this.serviciocliente.getFormularioslist(this.Lang).subscribe((data: any[])=> {
      this.dataSource = data; // Asigna los datos obtenidos al dataSource
      this.filteredDataSource = data;
      this.totalItems = data.length; // Establece el total de ítems
      this.determinarTipoPersona(); // Determinar el tipo de persona después de cargar los datos
      this.isLoading = false;
    });
  }

  abrirModal() {

    let modalElement;
if (this.Lang ==='es')
{
   modalElement = this.modalTerminos.nativeElement;
}else
{
   modalElement = this.modalTerminosEN.nativeElement;
}


    const modalDialog = modalElement.querySelector('.modal-dialog');

    // Asegúrate de que el scroll está al principio
    this.renderer.setProperty(modalDialog, 'scrollTop', 0);

    this.renderer.setStyle(modalElement, 'display', 'block'); // Mostrar el modal
    this.renderer.addClass(modalElement, 'show'); // Añadir clase 'show' para Bootstrap
    this.renderer.addClass(document.body, 'modal-open'); // Prevenir el desplazamiento
  }

  cerrarModal() {

    let modalElement;
if (this.Lang ==='es')
{
   modalElement = this.modalTerminos.nativeElement;
}else
{
   modalElement = this.modalTerminosEN.nativeElement;
}

   // modalElement = this.modalTerminos.nativeElement;
    this.renderer.setStyle(modalElement, 'display', 'none'); // Ocultar el modal
    this.renderer.removeClass(modalElement, 'show'); // Eliminar clase 'show' para Bootstrap
    this.renderer.removeClass(document.body, 'modal-open'); // Permitir el desplazamiento
  }

  edit(element: any) {

    const FormDespacho = {
      id : element.id,
      idUsuario:element.idUsuario,
      nombreUsuario:element.nombreUsuario,
      idEstado:element.idEstado,
      estado:element.estado,
      fechaFormulario:element.fechaFormulario,
    }

    this.ServicioEdit.setNuevoFormulario(FormDespacho);


if (this.NombreRol==='Proveedor/Cliente')
{
  this.router.navigate(['/pages/dash/CrearFormulario']);

}else{
  this.router.navigate(['/pages/dash/ValidarFormulario']);

}

  }

  openConfirmDeleteModal(item: any): void {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent);
    modalRef.componentInstance.itemName = item.id;

    modalRef.result.then((result) => {
      if (result) {
        this.deleteRegistro(item.id);
      }
    }).catch((error) => {
      console.log('Modal dismissed with error:', error);
    });
  }

  deleteRegistro(id: number): void {



  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) {
      return 'bi-arrow-down-up';
    }
    return this.sortDirection === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  }

  getRowClass(element: any): string {
    const classes = [];

    if (element.estado === 'Rechazado') {
      classes.push('row-danger');
    } else if (element.estado === 'Aprobado') {
      classes.push('row-success');
    } else if (element.estado === 'Enviado') {
      classes.push('row-warning');
    }

    return classes.join(' ');
  }

  getCardClass(element: any): string {
    const classes = ['form-card'];
    if (element.estado==="Pendiente Control Interno") {
      element.estado="Pendiente Verificador Cumplimiento"
    }
    if (element.estado === 'Rechazado') {
      classes.push('card-danger');
    } else if (element.estado === 'Aprobado') {
      classes.push('card-success');
    } else if (element.estado === 'Enviado') {
      classes.push('card-warning');
    }

    return classes.join(' ');
  }
  getUserAvatarClass(element: any): string {

    if (this.NombreRol === 'Administrador') {
      return 'admin-avatar';
    } else if (this.NombreRol === 'Proveedor/Cliente') {
      return 'client-avatar';
    }
    return '';
  }


  parseDate(dateString: string | Date): Date | null {
    if (!dateString) return null;

    if (dateString instanceof Date) {
      return dateString;
    }

    try {

      if (typeof dateString === 'string') {

        let cleanDateString = dateString.replace(/a\.\s*m\./gi, 'AM').replace(/p\.\s*m\./gi, 'PM');


        const parsedDate = new Date(cleanDateString);

        if (isNaN(parsedDate.getTime())) {

          const dateTimeRegex = /(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})\s*(a\.\s*m\.|p\.\s*m\.)/i;
          const match = dateString.match(dateTimeRegex);

          if (match) {
            const [, day, month, year, hour, minute, second, ampm] = match;
            let hour24 = parseInt(hour);


            if (ampm.toLowerCase().includes('p') && hour24 !== 12) {
              hour24 += 12;
            } else if (ampm.toLowerCase().includes('a') && hour24 === 12) {
              hour24 = 0;
            }

            const newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hour24, parseInt(minute), parseInt(second));


            if (!isNaN(newDate.getTime())) {
              return newDate;
            }
          }


          const standardDate = new Date(dateString);
          if (!isNaN(standardDate.getTime())) {
            return standardDate;
          }
        } else {
          return parsedDate;
        }
      }
    } catch (error) {
      console.warn('Error parsing date:', dateString, error);
    }

    return null;
  }


  getFormattedDate(date: string | Date, format: string = 'dd/MM/yyyy'): string {
    try {
      const parsedDate = this.parseDate(date);
      if (!parsedDate) return '';


      switch (format) {
        case 'dd/MM/yyyy':
          return parsedDate.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        case 'HH:mm':
          return parsedDate.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        case 'full':
          return parsedDate.toLocaleString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        default:
          return parsedDate.toLocaleDateString('es-ES');
      }
    } catch (error) {
      console.warn('Error formatting date:', date, format, error);
      return '';
    }
  }


  getRelativeTime(date: string | Date): string {
    try {
      const now = new Date();
      const targetDate = this.parseDate(date);

      if (!targetDate) return '';

      const diffInMs = now.getTime() - targetDate.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

      if (diffInDays > 0) {
        return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
      } else if (diffInHours > 0) {
        return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
      } else if (diffInMinutes > 0) {
        return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
      } else {
        return 'Hace un momento';
      }
    } catch (error) {
      console.warn('Error calculating relative time:', date, error);
      return '';
    }
  }


  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  // Clear all filters
  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.sortField = '';
    this.sortDirection = 'asc';
    this.applyFilter();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;

  }

  getStartRecord(): number {
    return ((this.currentPage - 1) * this.pageSize) + 1;
  }

  getEndRecord(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.filteredDataSource.length ? this.filteredDataSource.length : end;
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredDataSource.length / this.pageSize);
  }

  trackByFormId(index: number, item: any): any {
    return item.id || index;
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applySorting();
  }

  private applySorting(): void {
    this.filteredDataSource.sort((a, b) => {
      let valueA = a[this.sortField];
      let valueB = b[this.sortField];


      if (this.sortField === 'fechaFormulario') {
        const dateA = this.parseDate(valueA);
        const dateB = this.parseDate(valueB);

        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;

        valueA = dateA.getTime();
        valueB = dateB.getTime();
      }

      let comparison = 0;
      if (valueA > valueB) {
        comparison = 1;
      } else if (valueA < valueB) {
        comparison = -1;
      }

      return this.sortDirection === 'desc' ? comparison * -1 : comparison;
    });
  }

  applyFilter() {
    let filtered = this.dataSource.filter(element => {

      let formattedDate = '';
      try {
        formattedDate = this.getFormattedDate(element.fechaFormulario, 'dd/MM/yyyy');
      } catch (error) {
        console.warn('Error formatting date for filter:', element.fechaFormulario, error);
      }

      const matchesSearch = !this.searchTerm ||
        element.id.toString().includes(this.searchTerm) ||
        element.nombreUsuario.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        element.estado.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        formattedDate.includes(this.searchTerm) ||
        (element.fechaFormulario && element.fechaFormulario.toString().toLowerCase().includes(this.searchTerm.toLowerCase()));


      const matchesStatus = !this.selectedStatus || element.estado === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });

    this.filteredDataSource = filtered;


    if (this.sortField) {
      this.applySorting();
    }

    this.totalItems = this.filteredDataSource.length;
    this.currentPage = 1;
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
  getPagedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = this.currentPage * this.pageSize;
    return this.filteredDataSource.slice(startIndex, endIndex);
  }

  CrearFormulario(){
    this.isLoading = true;

      this.serviciocliente.CrearNuevoFormulario().subscribe(data => {
        this.ServicioEdit.setNuevoFormulario(data);
        this.isLoading = false;

        this.router.navigate(['/pages/dash/CrearFormulario']);
      });


}

  exportToExcel(): void {
    const dataToExport = this.filteredDataSource.map(item => ({
      Id: item.id,
      Usuario: item.nombreUsuario,
      Estado: item.estado,
      Fecha: this.getFormattedDate(item.fechaFormulario, 'dd/MM/yyyy') + ' ' + this.getFormattedDate(item.fechaFormulario, 'HH:mm')
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);

    // Formato para los encabezados (títulos)
    const headerStyle: XLSX.Sheet = {
      font: { bold: true, color: { rgb: 'FFFF0000' } }, // Color rojo (formato ARGB)
      alignment: { horizontal: 'center' }
    };

    // Aplicar el formato al rango de encabezados (A1:D1)
    const range: XLSX.Range = {
      s: { r: 0, c: 0 }, // Comienza en la fila 0, columna 0
      e: { r: 0, c: 3 }  // Termina en la fila 0, columna 3 (A1:D1)
    };
    ws['!cols'] = [{ width: 15 }, { width: 20 }, { width: 15 }, { width: 20 }]; // Ajustar el ancho de las columnas

    // Aplicar estilo al rango de encabezados
    ws['A1'].s = headerStyle;
    ws['B1'].s = headerStyle;
    ws['C1'].s = headerStyle;
    ws['D1'].s = headerStyle;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos Exportados');
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'export');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }

  exportExcel(): void {
    const dataToExport = this.dataSource.map(item => ({
      Id: item.id,
      Nombre: item.nombreUsuario,
      NombreArea: item.nombreArea,
      NombreActividad: item.nombreActividad,
      NombreCliente: item.nombreCliente,
      NombreServicio: item.nombreServicio,
      NumeroHoras: item.numeroHoras,
    }));

    const fecha = new Date();
    const fechatotal =
      fecha.getDate() +
      '-' +
      (fecha.getMonth() + 1) +
      '-' +
      fecha.getFullYear() +
      '_' +
      fecha.getHours() +
      '-' +
      fecha.getMinutes() +
      '-' +
      fecha.getSeconds();

    // Crear libro de trabajo y hoja de trabajo
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Definir estilo para los encabezados (títulos)
    const headerStyle = {
      fill: { fgColor: { rgb: '#00BFFF' } }, // Fondo azul claro
      font: { color: { rgb: '#FFFFFF' }, bold: true }, // Texto en negrita y color blanco
    };

    // Definir nombres de columnas y aplicar estilo
    const colNames = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1'];
    colNames.forEach(col => {
      if (worksheet[col]) {
        const cell = worksheet[col];
        cell.s = headerStyle;
      }
    });

    // Agregar la hoja al libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja1');

    // Generar el nombre de archivo
    const nombreArchivo = `unificado-${fechatotal}.xlsx`;

    // Guardar el archivo
    const rutaArchivo = `api_operaciones/files/unificados/${nombreArchivo}`;
    XLSX.writeFile(workbook, rutaArchivo);
  }

  exportToExcel2(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Hoja1');

    // Definir estilo para los encabezados (títulos)
    const headerStyle = {
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '00BFFF' } // Fondo azul claro
      },
      font: {
        color: { argb: 'FFFFFF' }, // Texto en color blanco
        bold: true
      }
    };

    // Definir datos a exportar (dataSource debe ser un arreglo con los datos que quieres exportar)
    const dataToExport = this.filteredDataSource.map(item => ({
      Id: item.id,
      Nombre: item.nombreUsuario,
      Estado: item.estado,
      FechaFormulario: this.getFormattedDate(item.fechaFormulario, 'dd/MM/yyyy') + ' ' + this.getFormattedDate(item.fechaFormulario, 'HH:mm'),
    }));


    // Agregar encabezados a la hoja de trabajo
    worksheet.addRow(['ID', 'Nombre', 'Estado','FechaFormulario']);
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell, colNumber) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00BFFF' } // Fondo azul claro
    };
    cell.font = {
      color: { argb: 'FFFFFF' }, // Texto en color blanco
      bold: true
    };
  });
    // Agregar datos a la hoja de trabajo
    dataToExport.forEach(item => {
      worksheet.addRow([item.Id, item.Nombre, item.Estado, item.FechaFormulario]);
    });

    // Ajustar ancho de columnas (opcional)
    worksheet.columns.forEach(column => {
      column.width = 15;
    });

    // Generar el nombre de archivo
    const fecha = new Date();
    const fechatotal = `${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}_${fecha.getHours()}-${fecha.getMinutes()}-${fecha.getSeconds()}`;
    const nombreArchivo = `export-${fechatotal}.xlsx`;

    // Guardar el archivo y descargarlo
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, nombreArchivo);
    });
  }

  getUsuerId(): number {
    const tokenString = localStorage.getItem(this.tokenKey);
  if (!tokenString) {
    return 0;  // No hay token almacenado
  }
  try {
    const localestorage = JSON.parse(tokenString);
    const userid = localestorage.token.userId;
    return userid;
  } catch (e) {
    console.error('Error parsing token from localStorage', e);
    return 0;
  }
}

GenerarPdf(element: any)
{
  const FormDespacho = {
    id : element.id,
    idUsuario:element.idUsuario,
    nombreUsuario:element.nombreUsuario,
    idEstado:element.idEstado,
    estado:element.estado,
    fechaFormulario:element.fechaFormulario,
  }

  // Verificar si el formulario está en un estado que permite la descarga de PDF
  if (!this.puedeDescargarPDF(FormDespacho.idEstado, FormDespacho.estado)) {
    this.mostrarModalEstadoInvalido(FormDespacho.estado);
    return;
  }

  this.serviciocliente.descargarArchivo('PDFEnviado', FormDespacho.id).subscribe({
    next: (data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Formulario_${FormDespacho.id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (error) => {
      this.manejarErrorDescarga(error, FormDespacho.id);
    }
  });
}

private puedeDescargarPDF(idEstado: number, nombreEstado: string): boolean {
  // Estados que permiten descarga de PDF:
  // 3 = Aprobado, 4 = Rechazado, 5 = Enviado
  const estadosPermitidos = [3, 4, 5];
  return estadosPermitidos.includes(idEstado);
}

private mostrarModalEstadoInvalido(estado: string): void {
  const modalRef = this.modalService.open(AlertModalComponent, {
    centered: true,
    backdrop: 'static',
    keyboard: false
  });

  modalRef.componentInstance.title = 'PDF No Disponible';
  modalRef.componentInstance.name = `No se puede descargar el PDF porque el formulario está en estado "${estado}".

El PDF solo está disponible cuando el formulario ha sido:
• Enviado para revisión
• Aprobado por el administrador
• Rechazado con observaciones

Para generar el PDF, complete y envíe el formulario primero.`;
  modalRef.componentInstance.isError = false;
}

private manejarErrorDescarga(error: any, formularioId: number): void {
  let titulo = 'Error de Descarga';
  let mensaje = 'No se pudo descargar el archivo PDF.';
  let tipo = 'error';

  if (error.status === 404) {
    titulo = 'PDF No Encontrado';
    mensaje = `El archivo PDF del formulario ${formularioId} no se encuentra disponible.

Posibles causas:
• El PDF aún no ha sido generado por el sistema
• El archivo fue eliminado del servidor
• Error en el proceso de generación

Contacte al administrador del sistema para resolver este problema.`;
  } else if (error.status === 401) {
    titulo = 'Sesión Expirada';
    mensaje = 'Su sesión ha expirado. Por favor, inicie sesión nuevamente para continuar.';
  } else if (error.status === 403) {
    titulo = 'Sin Permisos';
    mensaje = 'No tiene permisos para descargar este archivo. Contacte al administrador para obtener los permisos necesarios.';
  } else if (error.status === 500) {
    titulo = 'Error del Servidor';
    mensaje = 'Error interno del servidor al generar el archivo PDF. Contacte al administrador del sistema.';
  } else if (error.status === 0 || !error.status) {
    titulo = 'Sin Conexión';
    mensaje = 'No se pudo conectar con el servidor. Verifique su conexión a internet e intente nuevamente.';
  }

  const modalRef = this.modalService.open(AlertModalComponent, {
    centered: true,
    backdrop: 'static',
    keyboard: false
  });

  modalRef.componentInstance.title = titulo;
  modalRef.componentInstance.name = mensaje;
  modalRef.componentInstance.isError = true;

  console.error('Error al descargar PDF:', error);
}

esRolValido(): boolean {
  return this.NombreRol === "Control Interno";
}

abrirlistas(element:any)
{
  const modalRef = this.modalService.open(ResultadoListasInspektorComponent, { centered: true,
    windowClass: 'custom-modal-width2'
  });

  modalRef.componentInstance.formularioId = element.id;
  modalRef.result.then((result) => {
    if (result) {

      console.log('Formulario Rechazado:', result.formularioId, 'Motivo:', result.motivo);
      // Lógica para manejar el rechazo del formulario
    }
  }, (reason) => {
    console.log('Modal dismissed:', reason);
  });
}

  copiarFormulario(element: any)
{
  const FormDespacho = {
    id : element.id,
    idUsuario:element.idUsuario,
    nombreUsuario:element.nombreUsuario,
    idEstado:element.idEstado,
    estado:element.estado,
    fechaFormulario:element.fechaFormulario,
  }
  const confirmacion = window.confirm("¿Desea copiar el contenido de este formulario a otro?");

  if (confirmacion) {
    this.isLoading = true;

    this.serviciocliente.CopiarFormualrio(FormDespacho.id).subscribe(data => {
      this.ServicioEdit.setNuevoFormulario(data);
      this.isLoading = false;
      this.router.navigate(['/pages/dash/CrearFormulario']);
    });
  } else {

    console.log("Operación de copiar formulario cancelada por el usuario.");
  }
}


  determinarTipoPersona() {

    this.esPersonaJuridica = true;
    this.esPersonaNatural = false;


  }


  cambiarTipoPersona(esNatural: boolean) {
    this.esPersonaNatural = esNatural;
    this.esPersonaJuridica = !esNatural;
  }

  getUsuarioId() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.userId;
    }
    return null;
  }


  getStatusClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'aprobado':
        return 'status-approved';
      case 'rechazado':
        return 'status-rejected';
      case 'enviado':
        return 'status-sent';
      case 'creado':
        return 'status-created';
      default:
        return 'status-default';
    }
  }

  getStatusIcon(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'aprobado':
        return 'bi-check-circle-fill';
      case 'rechazado':
        return 'bi-x-circle-fill';
      case 'enviado':
        return 'bi-send-fill';
      case 'creado':
        return 'bi-plus-circle-fill';
      default:
        return 'bi-circle-fill';
    }
  }

  getEditTooltip(element: any): string {
    if (element.idUsuario === this.userId && (element.idEstado === 1 || element.idEstado === 2 || element.idEstado === 6)) {
      return 'Editar formulario';
    }
    return 'Ver formulario';
  }

  canDelete(element: any): boolean {

    return element.idUsuario === this.userId && element.idEstado === 1;
  }

  deleteForm(element: any): void {
    const confirmacion = window.confirm("¿Está seguro de que desea eliminar este formulario?");
    if (confirmacion) {
      this.isLoading = true;

      console.log('Deleting form:', element.id);

      this.isLoading = false;
    }
  }

  viewDetails(element: any): void {
    console.log('Viewing details for form:', element);

  }
}
