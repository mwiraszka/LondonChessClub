import { FormControl, ValidationErrors } from '@angular/forms';

import { imageCaptionValidator } from './image-caption.validator';

describe('imageCaptionValidator', () => {
  it('returns `null` for an empty string', () => {
    expect(getErrorForValue('')).toBeFalsy();
  });

  it('returns `null` if valid', () => {
    expect(getErrorForValue('My caption!')).toBeFalsy();
    expect(
      getErrorForValue(
        'Text with all accepted characters: !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~',
      ),
    ).toBeFalsy();
  });

  it('returns `invalidImageCaption` error if invalid', () => {
    const error = { invalidImageCaption: true };

    expect(getErrorForValue('My invalid caption 😢')).toEqual(error);
    expect(getErrorForValue('À')).toEqual(error);
  });
});

function getErrorForValue(value: unknown): ValidationErrors | null {
  const control = new FormControl(value, imageCaptionValidator);
  return control.errors;
}
