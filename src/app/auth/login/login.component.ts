import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../authservices/auth.services';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MensajeModalComponent } from '../mensaje-modal/mensaje-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
declare var bootstrap: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('modal') modal: ElementRef;
  private modalService = inject(NgbModal);
  Mensaje:string='';
  boolerror=false;
  isLoading = false;
  isError: boolean=false;
  @Input() error: string | null;
  user: any;
  @Output() submitEM = new EventEmitter();
  email: string = '';
  password: string = '';
  isChecked: boolean = false;
  files: File[] = [];
  isDragging = false;
  captchaCode:string;

  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required] ),
    password: new FormControl('',[Validators.required]),
    captcha: new FormControl('',[Validators.required]),
    loginType: new FormControl('nombre', [Validators.required])
  });
  constructor(private authService: AuthService, private router: Router,private translate: TranslateService) {
    this.translate.setDefaultLang('es');
    // Opcional: cargar el idioma basado en una preferencia del usuario
    const lang = localStorage.getItem('language') || 'es';
    this.translate.use(lang);
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }


  login(): void {
    this.isLoading = true;
    this.user = this.form.value;

    // Verificar el CAPTCHA antes de proceder con la autenticación
    if (this.form.controls['captcha'].value !== this.captchaCode) {
      const lang = localStorage.getItem('language') || 'es';
      this.isLoading = false;
      console.error('CAPTCHA incorrecto');
      this.boolerror = true;
      this.isError = true;

      let title;

      if (lang ==='es')
      {
        this.Mensaje = 'El CAPTCHA ingresado es incorrecto. Por favor, inténtelo de nuevo.';
        title="";
      }else
      {
        this.Mensaje = 'The CAPTCHA you entered is incorrect. Please try again.';
        title="";
      }


      const modalRef = this.modalService.open(MensajeModalComponent);
      modalRef.componentInstance.name = this.Mensaje;
      modalRef.componentInstance.title = title;
      modalRef.componentInstance.isError = true;
      this.generateCaptcha(); // Generar un nuevo CAPTCHA si el anterior es incorrecto
      return; // Salir del método si el CAPTCHA es incorrecto
    }

    // Proceder con la autenticación si el CAPTCHA es correcto
    const loginType = this.form.get('loginType')?.value;
    const loginValue = this.user.username;


    this.authService.login(loginValue, this.user.password).subscribe(
      (response: any) => {
        this.authService.setToken(response);
        this.isLoading = false;
        this.router.navigate(['/pages/dash/ListaFormulariosUsuario']);
      },
      (error: any) => {
        this.isLoading = false;
        console.error('Error al iniciar sesión:', error);
        this.boolerror = true;
        this.isError = true;
        this.Mensaje = 'Por favor validar Credenciales';
        const modalRef = this.modalService.open(MensajeModalComponent);
        modalRef.componentInstance.name = loginType === 'documento' ?
          'Error al iniciar sesión. Por favor valide el número de documento y contraseña' :
          'Error al iniciar sesión. Por favor valide el nombre de usuario y contraseña';
        modalRef.componentInstance.title = 'Error';
        modalRef.componentInstance.isError = true;
      }
    );
  }

  ngOnInit(): void {
    this.generateCaptcha();
  }

  sanitizeValues(values: any) {
    // Implementa tu lógica de sanitización aquí
    const sanitizedValues = { ...values };
    sanitizedValues.username = this.sanitizeInput(sanitizedValues.username);
    sanitizedValues.password = this.sanitizeInput(sanitizedValues.password);
    // ...otros campos

    return sanitizedValues;
  }

  sanitizeInput(input: any): any {
    // Ejemplo de sanitización básica
    if (typeof input === 'string') {
      return input.replace(/[^\w\s]/gi, '');
    }
    return input;
  }

  abrirModal() {
    const modalElement = this.modal.nativeElement;
    modalElement.style.display = 'block'; // Mostrar el modal
    modalElement.classList.add('show'); // Añadir clase 'show' para Bootstrap
    document.body.classList.add('modal-open'); // Prevenir el desplazamiento
  }

  cerrarModal() {
    this.hideLoadingModal();
    const modalElement = this.modal.nativeElement;
    modalElement.style.display = 'none'; // Ocultar el modal
    modalElement.classList.remove('show'); // Quitar clase 'show'
    document.body.classList.remove('modal-open'); // Permitir el desplazamiento
  }


  showLoadingModal() {
    this.isLoading = true;
    const myModal = new bootstrap.Modal(document.getElementById('loadingModal'), {
      keyboard: false
    });
    myModal.show();
  }

  hideLoadingModal() {
    this.isLoading = false;
    const myModalEl = document.getElementById('loadingModal');
    const modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
  }

  private generateCaptcha(): void {
    this.captchaCode = this.createCaptcha();
    this.renderCaptcha();
  }

  private createCaptcha(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  private renderCaptcha(): void {
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('captchaCanvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '30px Arial';
      ctx.fillStyle = '#000';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      // Draw random lines for added complexity
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = this.getRandomColor();
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }

      // Draw captcha text
      ctx.fillStyle = this.getRandomColor();
      ctx.fillText(this.captchaCode, canvas.width / 2, canvas.height / 2);

      // Add noise
      for (let i = 0; i < 150; i++) {
        ctx.fillStyle = this.getRandomColor();
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
      }
    }
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  refreshCaptcha(): void {
    this.generateCaptcha();
  }

}

