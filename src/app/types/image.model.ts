import { Id, IsoDate, Url } from './core.model';

export interface Image {
  dateUploaded: IsoDate;
  id?: Id;
  presignedUrl: Url;
  size: number;
}
