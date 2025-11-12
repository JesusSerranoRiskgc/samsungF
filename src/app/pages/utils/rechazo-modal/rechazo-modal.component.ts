import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rechazo-modal',
  templateUrl: './rechazo-modal.component.html',
  styleUrl: './rechazo-modal.component.scss'
})
export class RechazoModalComponent implements OnInit {
  @Input() formularioId!: number;
  @Input() isReadOnly = false;
  @Input() initialMotivo = '';

  rechazoForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {
    this.rechazoForm = this.fb.group({
      motivo: [{ value: '', disabled: this.isReadOnly }, Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.initialMotivo) {
      this.rechazoForm.get('motivo')?.setValue(this.initialMotivo);
    }
  }

  closeModal(): void {
    this.activeModal.dismiss();
  }

  rechazarFormulario(): void {
    if (this.rechazoForm.valid) {
      const motivo = this.rechazoForm.get('motivo')?.value;
      console.log('Formulario Rechazado:', this.formularioId, 'Motivo:', motivo);
      this.activeModal.close({ formularioId: this.formularioId, motivo: motivo });
    }else{
      this.rechazoForm.get('motivo')?.markAsTouched();

    }
  }
}
