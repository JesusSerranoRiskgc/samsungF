import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alerta-guardado-sin-validacion',
  templateUrl: './alerta-guardado-sin-validacion.component.html',
  styleUrl: './alerta-guardado-sin-validacion.component.scss'
})
export class AlertaGuardadoSinValidacionComponent {
  activeModal = inject(NgbActiveModal);
	@Input() name: string;
  @Input() title: string;
  @Input() isError: boolean;


  ngOnInit(): void {
    // Cerrar el modal automáticamente después de 3 segundos
    setTimeout(() => {
      this.activeModal.close();
    }, 2000);
  }

}
