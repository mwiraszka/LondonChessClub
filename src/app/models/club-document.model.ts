import { IsoDate } from './core.model';

export interface ClubDocument {
  title: string;
  fileName: string;
  datePublished: IsoDate;
  dateLastModified: IsoDate;
}
