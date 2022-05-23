import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeTypeValidator = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof control.value === 'string') {
    return of(null);
  }

  const file = control.value as File;
  const fileReader = new FileReader();

  const fileReaderObservable = new Observable(
    (observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener('loadend', () => {
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
        let header = '';
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }

        switch (header) {
          case '89504e47':
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
          case 'ffd8ffe3':
          case 'ffd8ffe8':
            observer.next(null);
            observer.complete();
            break;
          default:
            observer.next({ invalidMimeType: true });
            observer.complete();
            break;
        }
      });
      fileReader.readAsArrayBuffer(file);
    }
  );

  return fileReaderObservable;
};
