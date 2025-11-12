import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServicioPrincipalService } from '../Services/main.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertModalComponent } from '../utils/alert-modal/alert-modal.component';
import { CustomValidators } from '../utils/FormatoPass/CustomValidators ';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.component.html',
  styleUrl: './mi-cuenta.component.scss'
})
export class MiCuentaComponent {
  private modalService = inject(NgbModal);
  changepassoForm: FormGroup;
  constructor(private serviciocliente : ServicioPrincipalService,private fb: FormBuilder,private translate: TranslateService) {

    this.changepassoForm = this.fb.group({
      contraseñaActual: ['', Validators.required],
      newContraseña: ['', [Validators.required, CustomValidators.passwordStrength()]],
      confirmContraseña: ['', Validators.required],
     
    }, { validators: CustomValidators.passwordsMatch('newContraseña', 'confirmContraseña') });

   }


  onSubmit() {
    if (this.changepassoForm.valid) 
      {

        const changepass: passchange = {
          password: this.changepassoForm.value.contraseñaActual,
          newpassword: this.changepassoForm.value.newContraseña
      }

    this.serviciocliente.changepassword(changepass).subscribe(
      (response) => {    

        const modalRef = this.modalService.open(AlertModalComponent);
        modalRef.componentInstance.name = 'Contraseña Actualizada correctamente';
        modalRef.componentInstance.title = '!';

        this.resetForm();
        // Aquí podrías manejar la respuesta del servidor si es necesario
      },
      (error) => {
        const modalRef = this.modalService.open(AlertModalComponent);
        modalRef.componentInstance.name = 'Error al cambiar contraseña';
        modalRef.componentInstance.title = 'Error';

        this.resetForm();
        // Aquí podrías manejar el error y mostrar un mensaje al usuario
      }
    );

  }
}

resetForm() {
  this.changepassoForm.reset();
    // Optionally mark all fields as pristine and untouched to reset validation state
    Object.keys(this.changepassoForm.controls).forEach(key => {
      const control = this.changepassoForm.get(key);
      if (control) {
        control.markAsPristine();
        control.markAsUntouched();
      }
    });
  }


}

interface passchange {
  password: string;
  newpassword: string;

}