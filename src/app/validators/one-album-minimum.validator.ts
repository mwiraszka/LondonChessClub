import { AbstractControl, ValidationErrors } from '@angular/forms';

export function oneAlbumMinimumValidator(
  formGroup: AbstractControl,
): ValidationErrors | null {
  const albums = formGroup.get('albums')?.value;
  const newAlbum = formGroup.get('newAlbum')?.value;

  return albums?.length || newAlbum ? null : { albumRequired: true };
}
