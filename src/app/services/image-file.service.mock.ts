import { Injectable } from '@angular/core';

import { LccError } from '@app/models';

@Injectable()
export class MockImageFileService {
  private mockError: LccError = {
    name: 'LCCError',
    message: 'This is a mock error',
  };

  public storeImageFile = jest.fn();
  public getImage = jest.fn();
  public getAllImages = jest.fn(() => this.mockError);
  public deleteImage = jest.fn();
  public clearAllImages = jest.fn();
}
