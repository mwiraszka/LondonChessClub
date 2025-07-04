import { AbstractControl, ValidationErrors } from '@angular/forms';

export function oneAlbumMinimumValidator(
  formGroup: AbstractControl,
): ValidationErrors | null {
  const albums = formGroup.get('albums')?.value;
  const album = formGroup.get('album')?.value;

  return albums?.length || album ? null : { albumRequired: true };
}
