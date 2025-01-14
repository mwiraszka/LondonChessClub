import { Id, IsoDate, Url } from './core.model';

export interface Image {
  articleAppearances: number;
  dateUploaded: IsoDate;
  id: Id;
  presignedUrl: Url;
  fileSize: number;
}
