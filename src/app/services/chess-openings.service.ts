import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { parseCsv } from '@app/utils';

@Injectable({
  providedIn: 'root',
})
export class ChessOpeningsService {
  /**
   * @returns A map of ECO codes mapped to their corresponding opening names
   */
  public fetchOpenings(): Observable<Map<string, string> | null> {
    return from(parseCsv('assets/eco-openings.csv')).pipe(
      map(rowsOfData => {
        if (!rowsOfData?.length) {
          return null;
        }
        return new Map(
          rowsOfData.map(rowOfData => {
            const openingEco = rowOfData[0];
            const openingName = this.getOpeningName(rowOfData);
            return [openingEco, openingName];
          }),
        );
      }),
    );
  }

  private getOpeningName(rowOfData: string[]): string {
    if (rowOfData.length < 2) {
      return 'Unknown opening';
    }

    const values = rowOfData.slice(1);

    if (values.length === 1 || !values[0].startsWith('"')) {
      return values[0];
    }

    if (values.length === 2 || values[1].endsWith('"')) {
      return values[0] + values[1];
    }

    return values[0] + values[1] + values[2];
  }
}
