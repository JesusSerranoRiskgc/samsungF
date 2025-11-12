import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MensajeModalComponent } from '../mensaje-modal/mensaje-modal.component';
import { AuthService } from '../authservices/auth.services';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrl: './recuperar-password.component.scss'
})
export class RecuperarPasswordComponent {
  private modalService = inject(NgbModal);
  recuperarForm: FormGroup;
  isLoading = false;
  user: any;
  isError: boolean=false;
  Mensaje:string='';
  constructor(private fb: FormBuilder,private authService: AuthService, private router: Router,private translate: TranslateService) {
    this.recuperarForm = this.fb.group({
      usuario: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]]
    });
    this.translate.setDefaultLang('es');
    // Opcional: cargar el idioma basado en una preferencia del usuario
    const lang = localStorage.getItem('language') || 'es';
    this.translate.use(lang);
  }
  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.isLoading = true;
    if (this.recuperarForm.valid) {
      const usuario = this.recuperarForm.value.usuario;
      const correoElectronico = this.recuperarForm.value.correoElectronico;     

      this.authService.recuperacion(usuario, correoElectronico).subscribe(
        (response:any) => {
         // const token = response.token.access_token;
          this.authService.setToken(response);
    // Si el inicio de sesión es exitoso, redirige a la página principal
    this.isLoading = false;

    this.Mensaje='Credenciales Restauradas'
    const modalRef = this.modalService.open(MensajeModalComponent);
    modalRef.componentInstance.name = 'Sus credenciales fueron restauradas por favor valide su bandeja de entrada';
    modalRef.componentInstance.title = 'Credenciales Restauradas';
    modalRef.componentInstance.isError=false;
    this.router.navigate(['/pages/dash/login']);

  },
  (error:any) => {
    // En caso de error, muestra un mensaje al usuario o toma otra acción adecuada
    console.error('Error al Restaurar Credenciales:', error);
    this.isLoading = false;
   
    this.isError=true;
    this.Mensaje='Por favor validar Credenciales'
    const modalRef = this.modalService.open(MensajeModalComponent);
    modalRef.componentInstance.name = 'Error al Restaurar credenciales por favor valide Con el administador';
    modalRef.componentInstance.title = 'Error';
    modalRef.componentInstance.isError=true;
    this.isLoading = false;
    // Por ejemplo, podrías mostrar un mensaje de error en el formulario
  }
  );
      
      // Por lo general, aquí se enviarían los datos a tu servicio para procesar la recuperación de contraseña
    } else {
      this.isLoading = false;
   
    this.isError=true;
    this.Mensaje='Por favor validar Credenciales'
    const modalRef = this.modalService.open(MensajeModalComponent);
    modalRef.componentInstance.name = 'Error al Restaurar credenciales por favor ingrese bien la informacion que se le solicita';
    modalRef.componentInstance.title = 'Error';
    modalRef.componentInstance.isError=true;
    }
  }

}