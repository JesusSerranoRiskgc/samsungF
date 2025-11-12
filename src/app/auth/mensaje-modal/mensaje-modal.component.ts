import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-mensaje-modal',
  templateUrl: './mensaje-modal.component.html',
  styleUrl: './mensaje-modal.component.scss'
})
export class MensajeModalComponent {
	activeModal = inject(NgbActiveModal);

	@Input() name: string;
  @Input() title: string;
  @Input() isError: boolean;
}
