import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function multipleOfHalfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value == null || value === '') {
      return null; // No hay valor, se maneja con Validators.required
    }
    return value % 0.25 === 0 ? null : { notMultipleOfHalf: true };
  };
}


export function convertStringToDate(dateString: string): { year: number, month: number, day: number } | null {
  const [day, month, year] = dateString.split('-').map(part => parseInt(part, 10));
  if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
    return { year: year, month: month, day: day };
  }
  return null;
}