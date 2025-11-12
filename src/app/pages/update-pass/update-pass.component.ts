import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServicioPrincipalService } from '../Services/main.services';
import { CustomValidators } from '../utils/FormatoPass/CustomValidators ';
import { AlertModalComponent } from '../utils/alert-modal/alert-modal.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-update-pass',
  templateUrl: './update-pass.component.html',
  styleUrl: './update-pass.component.scss'
})
export class UpdatePassComponent implements OnInit {
  private modalService = inject(NgbModal);
  Lang:string='es';
  changepassoForm: FormGroup;
  constructor(private serviciocliente : ServicioPrincipalService,private fb: FormBuilder,private router: Router,private translate: TranslateService) {
    this.changepassoForm = this.fb.group({      
      newContraseña: ['', [Validators.required, CustomValidators.passwordStrength()]],
      confirmContraseña: ['', Validators.required],
     
    }, { validators: CustomValidators.passwordsMatch('newContraseña', 'confirmContraseña') });

    this.Lang = localStorage.getItem('language') || 'es';
    this.translate.use(this.Lang);

  }

  ngOnInit(){

    let name;
    let Title;
    if (this.Lang ==='es')
      {
        name ='Debe actualizar su contraseña para poder continuar';
        Title='Advertencia';
      }else
      {
        name ='You must update your password to continue.';
        Title='Warning';
      }


    const modalRef = this.modalService.open(AlertModalComponent);
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.title = Title;


  }

  onSubmit() {
    if (this.changepassoForm.valid) 
      {

        const changepass: passupdate = {
          newpassword: this.changepassoForm.value.newContraseña
      }

      this.serviciocliente.updatepassword(changepass).subscribe(
        (response) => {    

          let name;
          let Title;
          if (this.Lang ==='es')
            {
              name ='Contraseña Actualizada correctamente';
              Title='';
            }else
            {
              name ='Password Updated Successfully';
              Title='';
            }
  
          const modalRef = this.modalService.open(AlertModalComponent);
          modalRef.componentInstance.name = name;
          modalRef.componentInstance.title = Title;
          modalRef.componentInstance.isError=false;
          this.resetForm();
  
  
          this.router.navigate(['/pages/dash/ListaFormulariosUsuario']);        
        },
        (error) => {

          let name;
          let Title;
          if (this.Lang ==='es')
            {  
              Title='Error actualizando contraseña';
            }else
            {
              Title='Error updating password';
            }

          const modalRef = this.modalService.open(AlertModalComponent);
          modalRef.componentInstance.name = error.error;
          modalRef.componentInstance.title = Title;
          modalRef.componentInstance.isError=true;
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

interface passupdate {
  newpassword: string;

}
