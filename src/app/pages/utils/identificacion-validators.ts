import { AbstractControl, ValidatorFn, Validators, FormGroup, FormArray } from '@angular/forms';

/**
 * validación de campos de identificación
 * Provee funcionalidad unificada para validar campos de tipo y número de identificación
 *
 */
export class IdentificacionValidators {

  // IDs de tipos de documento que requieren solo números
  private static readonly numericDocumentIds = [1, 2, 3];

  /**
   * update numero de indentificación validators segun el tipo de identificación
   */
  static updateNumeroIdentificacionValidators(numeroIdControl: AbstractControl | null, tipoId: any): void {
    if (!numeroIdControl) return;

    const isNumericOnly = this.numericDocumentIds.includes(Number(tipoId));

    if (isNumericOnly) {
      numeroIdControl.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]*$/)
      ]);
    } else {
      numeroIdControl.setValidators([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]*$/)
      ]);
    }
    numeroIdControl.updateValueAndValidity();
  }

  /**
   * Bloquea entrada de letras cuando el tipo de identificación es numérico
   */
  static allowOnlyNumbers(event: KeyboardEvent, tipoIdValue: any): void {
    const isNumericField = this.numericDocumentIds.includes(Number(tipoIdValue));

    if (isNumericField) {
      const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
      const charCode = event.key.charCodeAt(0);

      if (
        !allowedKeys.includes(event.key) &&
        (charCode < 48 || charCode > 57)
      ) {
        event.preventDefault();
      }
    }
  }

  static validateNumeroIdentificacionInput(event: any, tipoIdValue: any, controlToUpdate?: AbstractControl | null): void {
    const isNumericField = this.numericDocumentIds.includes(Number(tipoIdValue));

    if (isNumericField) {
      const value = event.target.value;
      // remueve caracter que no sea numero
      const numericValue = value.replace(/[^0-9]/g, '');
      if (value !== numericValue) {
        event.target.value = numericValue;
        if (controlToUpdate) {
          controlToUpdate.setValue(numericValue);
        }
      }
    }
  }

  /**
   * Verifica si un tipo de documento requiere solo números
   */
  static isNumericDocumentType(tipoId: any): boolean {
    return this.numericDocumentIds.includes(Number(tipoId));
  }

  /**
   * Configuracion cuando el tipo de identificacion esta dentro de un FormGroup
   */
  static setupIdentificacionValidationForFormGroup(
    formGroup: FormGroup,
    tipoIdFieldName: string = 'tipoIdentificacion',
    numeroIdFieldName: string = 'numeroIdentificacion'
  ): void {
    const tipoControl = formGroup.get(tipoIdFieldName);
    const numeroControl = formGroup.get(numeroIdFieldName);

    if (tipoControl && numeroControl) {
      // validation inicial
      this.updateNumeroIdentificacionValidators(numeroControl, tipoControl.value);

      tipoControl.valueChanges.subscribe((tipoId: any) => {
        this.updateNumeroIdentificacionValidators(numeroControl, tipoId);
      });
    }
  }

  /**
   * Config cuando el tipo de identifacion esta dentro de FormArrays
   * componentes  Accionistas, RepresentanteLegal, etc.
   */
  static setupIdentificacionValidationForFormArray(
    formArray: FormArray,
    tipoIdFieldName: string = 'tipoDocumento',
    numeroIdFieldName: string = 'NumeroIdentificacion'
  ): void {
    formArray.controls.forEach((control: AbstractControl) => {
      if (control instanceof FormGroup) {
        this.setupIdentificacionValidationForFormGroup(control, tipoIdFieldName, numeroIdFieldName);
      }
    });
  }

  static createKeypressHandler(
    getTipoIdValue: () => any
  ): (event: KeyboardEvent) => void {
    return (event: KeyboardEvent) => {
      const tipoId = getTipoIdValue();
      this.allowOnlyNumbers(event, tipoId);
    };
  }

  static createInputHandler(
    getTipoIdValue: () => any,
    getControl: () => AbstractControl | null
  ): (event: any) => void {
    return (event: any) => {
      const tipoId = getTipoIdValue();
      const control = getControl();
      this.validateNumeroIdentificacionInput(event, tipoId, control);
    };
  }

  static setupIdentificacionValidationForMultipleGroups(
    formGroups: FormGroup[],
    tipoIdFieldName: string = 'tipoIdentificacion',
    numeroIdFieldName: string = 'numeroIdentificacion'
  ): void {
    formGroups.forEach(formGroup => {
      this.setupIdentificacionValidationForFormGroup(formGroup, tipoIdFieldName, numeroIdFieldName);
    });
  }

  static configureNestedFormArray(
    parentFormGroup: FormGroup,
    formArrayName: string,
    tipoDocField: string = 'TipoIdentificacion',
    numeroIdField: string = 'NumeroIdentificacion'
  ): void {
    const formArray = parentFormGroup.get(formArrayName) as FormArray;
    if (formArray) {
      formArray.controls.forEach((control) => {
        if (control instanceof FormGroup) {
          this.setupIdentificacionValidationForFormGroup(control, tipoDocField, numeroIdField);
        }
      });
    }
  }

  static configureMultipleNestedFormArrays(
    parentFormGroup: FormGroup,
    arrayConfigs: Array<{
      arrayName: string;
      tipoDocField?: string;
      numeroIdField?: string;
    }>
  ): void {
    arrayConfigs.forEach(config => {
      this.configureNestedFormArray(
        parentFormGroup,
        config.arrayName,
        config.tipoDocField || 'TipoIdentificacion',
        config.numeroIdField || 'NumeroIdentificacion'
      );
    });
  }

  static configureFormArrayWithNestedArrays(
    mainFormArray: FormArray,
    mainTipoDocField: string,
    mainNumeroIdField: string,
    nestedArrayConfigs: Array<{
      arrayName: string;
      tipoDocField?: string;
      numeroIdField?: string;
    }> = []
  ): void {
    mainFormArray.controls.forEach((control) => {
      if (control instanceof FormGroup) {

        this.setupIdentificacionValidationForFormGroup(control, mainTipoDocField, mainNumeroIdField);

        this.configureMultipleNestedFormArrays(control, nestedArrayConfigs);
      }
    });
  }

  static allowOnlyNumbersNested(
    event: KeyboardEvent,
    parentFormGroup: FormGroup,
    formArrayName: string,
    itemIndex: number,
    tipoDocField: string = 'TipoIdentificacion'
  ): void {
    const formArray = parentFormGroup.get(formArrayName) as FormArray;
    if (formArray && formArray.at(itemIndex)) {
      const itemForm = formArray.at(itemIndex) as FormGroup;
      const tipoId = itemForm.get(tipoDocField)?.value;
      this.allowOnlyNumbers(event, tipoId);
    }
  }

  static validateNumeroIdentificacionInputNested(
    event: any,
    parentFormGroup: FormGroup,
    formArrayName: string,
    itemIndex: number,
    tipoDocField: string = 'TipoIdentificacion',
    numeroIdField: string = 'NumeroIdentificacion'
  ): void {
    const formArray = parentFormGroup.get(formArrayName) as FormArray;
    if (formArray && formArray.at(itemIndex)) {
      const itemForm = formArray.at(itemIndex) as FormGroup;
      const tipoId = itemForm.get(tipoDocField)?.value;
      const control = itemForm.get(numeroIdField);
      this.validateNumeroIdentificacionInput(event, tipoId, control);
    }
  }

  static emailWithComValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;

      if (!emailPattern.test(control.value)) {
        return { 'emailWithCom': { value: control.value } };
      }

      return null;
    };
  }

  /**
   * Bloquea entrada de letras en campos de teléfono, solo permite números
   */
  static allowOnlyNumbersForPhone(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const charCode = event.key.charCodeAt(0);

    if (
      !allowedKeys.includes(event.key) &&
      (charCode < 48 || charCode > 57)
    ) {
      event.preventDefault();
    }
  }

  /**
   * Valida entrada de teléfono y remueve caracteres no numéricos
   */
  static validatePhoneInput(event: any, controlToUpdate?: AbstractControl | null): void {
    const value = event.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    if (value !== numericValue) {
      event.target.value = numericValue;
      if (controlToUpdate) {
        controlToUpdate.setValue(numericValue);
      }
    }
  }

  /**
   *validación de teléfono para un FormGroup
   */
  static setupPhoneValidationForFormGroup(
    formGroup: FormGroup,
    phoneFieldName: string = 'Telefono'
  ): void {
    const phoneControl = formGroup.get(phoneFieldName);
    if (phoneControl) {
      const currentValidators = phoneControl.validator ? [phoneControl.validator] : [];
      phoneControl.setValidators([
        ...currentValidators.filter(v => v !== Validators.pattern(/^[0-9]+$/)),
        Validators.pattern(/^[0-9]+$/)
      ]);
      phoneControl.updateValueAndValidity();
    }
  }

  /**
   *validación de teléfono para FormArrays
   */
  static setupPhoneValidationForFormArray(
    formArray: FormArray,
    phoneFieldName: string = 'Telefono'
  ): void {
    formArray.controls.forEach((control: AbstractControl) => {
      if (control instanceof FormGroup) {
        this.setupPhoneValidationForFormGroup(control, phoneFieldName);
      }
    });
  }
}
