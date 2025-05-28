import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function uniqueAlbumValidator(existingAlbums: string[] = []): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control && existingAlbums.includes(control.value)
      ? { albumAlreadyExists: true }
      : null;
  };
}
