import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServicioPrincipalService } from '../../Services/main.services';
import { Router } from '@angular/router';
import { AlertModalComponent } from '../../utils/alert-modal/alert-modal.component';
import { InternalDataService } from '../../Services/InternalDataService';
import { noSeleccionadoValidator } from '../../utils/validcliente/validacionOpcionales';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {
  isSuperAdmin: boolean = false;
  user: any = {};
  isLoading = false;
  private modalService = inject(NgbModal);
  registroForm: FormGroup;
  areas: any[] = [];
  clientes: any[] = [];
  servicios: any[] = [];
  areaId: number | null = null;
  tipoUsuarios: { id: number, nombre: string }[] = [];
  compradorVendedor: any[] = [];

  constructor(
    private serviciocliente: ServicioPrincipalService,
    private fb: FormBuilder,
    private router: Router,private userDataService: InternalDataService
  ) { 
    this.tipoUsuarios = [
      { id: 1, nombre: 'Comprador' },
      { id: 2, nombre: 'Vendedor' },
      { id: 3, nombre: 'Contabilidad' },
      { id: 4, nombre: 'Control Interno' },
      { id: 5, nombre: 'Oficial de Cumplimiento' },
      { id: 6, nombre: 'Logística' },
      { id: 7, nombre: 'Proveedor/Cliente' },
      { id: 8, nombre: 'Comprador' }
    ];

    this.registroForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      identificacion: ['', Validators.required],      
      email: ['', Validators.required],
      idTipoUsuario: ['-1', [Validators.required, noSeleccionadoValidator()]],
      idCompreadorVendedor: ['-1', [Validators.required, noSeleccionadoValidator()]],
      Activo: [false],
    });
  


  }

  loadcompradorVendedor(): void {
    this.serviciocliente.getCompradorVendedor().subscribe(data => {
      this.compradorVendedor = data;
    });
  }

  validacambios(): void {
    this.registroForm.get('idTipoUsuario')?.valueChanges.subscribe((valorPais) => {
      if (valorPais !== '7') {
        this.registroForm.get('idCompreadorVendedor')?.clearValidators();
        this.registroForm.patchValue({ idCompreadorVendedor: '-1' }); 
      } else {
        this.registroForm.get('idCompreadorVendedor')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      }
      this.registroForm.get('idCompreadorVendedor')?.updateValueAndValidity();
    });
  }


  ngOnInit() {
    this.loadcompradorVendedor();
    this.validacambios();
    this.isLoading = true;
    this.user = this.userDataService.getUser();
    if (this.user) {
      this.user.activo = (this.user.activo === 'true' || this.user.activo === true);
      this.registroForm.patchValue({
        nombres: this.user.nombres,
        apellidos: this.user.apellidos,
        identificacion: this.user.identificacion,
        email: this.user.email,
        idTipoUsuario: this.user.idTipoUsuario.toString(),   
        idCompreadorVendedor: this.user.idCompradorVendedor.toString(),
        Activo: this.user.activo,

      });

      this.isLoading = false;
    }else{
      this.isLoading = false;
      this.router.navigate(['/pages/dash/ListaUsuarios']);
    }
  }

  onSubmit() {
    if (this.registroForm.valid) 
      {
        this.isLoading = true;
        const nuwuser: User = {
          id:this.user.id, 
          nombres:this.registroForm.value.nombres,
          apellidos:this.registroForm.value.apellidos,
          identificacion:this.registroForm.value.identificacion,
          email:this.registroForm.value.email,
          idTipoUsuario:this.registroForm.value.idTipoUsuario,
          idCompradorVendedor:this.registroForm.value.idTipoUsuario ==="7"? this.registroForm.value.idCompreadorVendedor : "-1", 
          activo:this.registroForm.value.Activo,
        }   
        
        this.serviciocliente.editUser(nuwuser).subscribe(
          (response) => {    
            this.isLoading = false;
            const modalRef = this.modalService.open(AlertModalComponent);
            modalRef.componentInstance.name = 'Usuario Editado correctamente';
            modalRef.componentInstance.title = '';
            this.router.navigate(['/pages/dash/ListaUsuarios']);
            
            // Aquí podrías manejar la respuesta del servidor si es necesario
          },
          (error) => {
            this.isLoading = false;
            const modalRef = this.modalService.open(AlertModalComponent);
            modalRef.componentInstance.name = error.error;
            modalRef.componentInstance.title = 'Error';
    
            
            // Aquí podrías manejar el error y mostrar un mensaje al usuario
          }
        );
     

    }
  }
  Cancelar(){
    this.router.navigate(['/pages/dash/ListaUsuarios']);

  }
}

interface User {
  id: number;
  nombres:string;
  apellidos:string;
  identificacion:string;
  email:string;
  idTipoUsuario:number;
  idCompradorVendedor: number;
  activo: boolean;

  
}
