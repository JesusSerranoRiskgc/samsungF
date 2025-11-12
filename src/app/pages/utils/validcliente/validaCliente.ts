import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validClient(clients: { id: number, nombre: string }[]) {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedValue = control.value;
    const isValid = clients.some(client => client.id === selectedValue);
    return isValid ? null : { invalidClient: true };
  };
}