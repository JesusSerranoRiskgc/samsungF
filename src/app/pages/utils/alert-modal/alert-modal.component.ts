import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrl: './alert-modal.component.scss'
})
export class AlertModalComponent {
  activeModal = inject(NgbActiveModal);
	@Input() name: string;
  @Input() title: string;
  @Input() isError: boolean;


  ngOnInit(): void {
    // Cerrar el modal automáticamente después de 3 segundos
  }

}

