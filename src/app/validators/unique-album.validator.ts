import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Factory function that creates a validator to check if a new album name already exists in the provided albums array.
 * @param existingAlbums - Array of existing album names to check against
 * @returns A validator function that checks if the newAlbum control value already exists in the albums array
 */
export function uniqueAlbumValidator(existingAlbums: string[] = []): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const newAlbumControl = formGroup.get('newAlbum');

    if (
      !newAlbumControl ||
      !newAlbumControl.value ||
      newAlbumControl.value.trim() === ''
    ) {
      return null;
    }

    return existingAlbums.includes(newAlbumControl.value)
      ? { albumAlreadyExists: true }
      : null;
  };
}
