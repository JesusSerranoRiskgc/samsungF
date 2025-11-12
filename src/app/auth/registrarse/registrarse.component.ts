import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../pages/Services/main.services';

declare const bootstrap: any;
@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.scss']
})
export class RegistrarseComponent {
  @ViewChild('modal') modal: ElementRef;
  @ViewChild('successModal') successModal: ElementRef;
  isLoading = false;
  Lang: string = 'es';
  private successModalInstance: any; 


  registroForm = new FormGroup({
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl(''),
    identificacion: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    terminos: new FormControl()
  });

  constructor(
    private servicioPrincipalService: ServicioPrincipalService,
    private router: Router,
    private translate: TranslateService
  ) {
    // Configuración de idioma
    this.translate.setDefaultLang('es');
    this.Lang = localStorage.getItem('language') || 'es';
    this.translate.use(this.Lang);
  }

  onSubmit() {
    if (this.registroForm.valid) {
      this.isLoading = true;

      // Construimos el objeto que tu backend (C#) espera en UsuarioDto
      const newUser = {
        Nombres: this.registroForm.value.nombres,
        Apellidos: this.registroForm.value.apellidos,
        Email: this.registroForm.value.email,
        Identificacion: this.registroForm.value.identificacion,
        IdTipoUsuario: 7,
        idCompradorVendedor: 0,  
        ActualizarPass: 1,
        Password: this.registroForm.value.password 
      };

      this.servicioPrincipalService.createnewUser(newUser).subscribe({
        next: (response) => {
          console.log('Usuario creado con éxito:', response);
          this.isLoading = false;
          this.openSuccessModal();
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
          this.isLoading = false;
        }
      });
    } else {
      // Si el formulario no es válido, marcamos todos los campos como 'touched'
      this.registroForm.markAllAsTouched();
    }
  }


  openSuccessModal() {
    const modalEl = this.successModal.nativeElement;
    this.successModalInstance = new bootstrap.Modal(modalEl);
    this.successModalInstance.show();
  }

  closeSuccessModal() {
    const modalEl = this.successModal.nativeElement;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.hide();
    this.router.navigate(['/auth/login']);
  }

  // Métodos para mostrar/ocultar el modal de términos
  abrirModal() {
    const modalElement = this.modal.nativeElement;
    modalElement.style.display = 'block';
    modalElement.classList.add('show');
    document.body.classList.add('modal-open');
  }

  cerrarModal() {
    const modalElement = this.modal.nativeElement;
    modalElement.style.display = 'none';
    modalElement.classList.remove('show');
    document.body.classList.remove('modal-open');
  }
}
