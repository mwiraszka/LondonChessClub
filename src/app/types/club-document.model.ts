import { IsoDate } from './core.model';

export interface ClubDocument {
  title: string;
  datePublished: IsoDate;
  dateLastModified: IsoDate;
  fileName: string;
}
