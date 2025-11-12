import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noSeleccionadoValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = Number(control.value);  // Convertir el valor a número
      return value === -1 ? { noSeleccionado: true } : null;
    };
  }